import sys
import json

from django.urls import reverse
from django.http import HttpResponseRedirect
from django.core.exceptions import ValidationError
from django.contrib.auth.models import update_last_login
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import *
from .serializers import *


@api_view(['POST'])
def notes(request):
    if request.method == 'POST':
        serializer = CreateNoteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            path = serializer.data.get("path")
            note = Note.objects.get(path=path)
            note_serializer = NoteSerializer(note, many=False)
            return Response(note_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def note(request, path):
    try:
        note = Note.objects.get(path=path)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':

        if note.password is None:
            serializer = NoteSerializer(note)
            return Response(serializer.data)

        else:
            serializer = NotePasswordSerializer(data=request.data)

            if serializer.is_valid():
                if request.data['password'] == note.password:
                    serializer = NoteSerializer(note)
                    return Response(serializer.data)
                else:
                    return Response({
                        "password": ["Password incorrect."]
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'PATCH':
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST', 'DELETE'])
def note_password(request, path):
    try:
        note = Note.objects.get(path=path)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = NotePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if note.password:
                return Response({
                    "password": ["Note already has a password."]
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                note.password = request.data['password']
                note.save()
                serializer = NoteSerializer(note)
                return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':

        if note.password and request.data.get('password') is None:
            return Response({
                "password": ["This field is required."]
            }, status=status.HTTP_400_BAD_REQUEST)

        elif note.password is None or (note.password and note.password == request.data.get('password')):
            note.password = None
            note.save()
            serializer = NoteSerializer(note)
            return Response(serializer.data)

        else:
            return Response({
                "password": ["Password incorrect."]
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        user_serializer = UserSerializer(user)
        update_last_login(None, user)
        return Response({
            "user": user_serializer.data,
            "token": {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def logout(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    refresh_token = body['refresh']

    if not refresh_token:
        return Response({"refresh": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except TokenError:
        # Token already blacklisted.
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def register(request):
    serializer = CreateUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        refresh = RefreshToken.for_user(user)
        user_serializer = UserSerializer(user)
        return Response({
            "user": user_serializer.data,
            "token": {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            # Check current password
            current_password = serializer.data.get("current_password")
            if not request.user.check_password(current_password):
                return Response({"current_password": ["Wrong password."]},
                                status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            request.user.set_password(serializer.data.get("new_password"))
            request.user.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def trackings(request):
    if request.method == 'GET':
        trackings = request.user.trackings.all()
        serializer = TrackingSerializer(trackings,  many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CreateTrackingSerializer(data=request.data)

        if serializer.is_valid():
            path = serializer.validated_data['path']
            note = Note.objects.filter(path=path).first()
            is_user_has_tracking = Tracking.objects.filter(note=note, user=request.user).exists()

            if is_user_has_tracking:
                return Response({
                    "path": [
                        "Tracking already exist."
                    ]
                }, status=status.HTTP_409_CONFLICT)
            else:
                t = Tracking(user=request.user, note=note)
                t.save()
                return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        serializer = RemoveTrackingSerializer(data=request.data)

        if serializer.is_valid():
            path = serializer.validated_data['path']
            note = Note.objects.filter(path=path).first()
            is_user_has_tracking = Tracking.objects.filter(note=note, user=request.user).exists()

            if is_user_has_tracking:
                t = Tracking.objects.filter(note=note, user=request.user).first()
                t.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({
                    "path": [
                        "Tracking not founded."
                    ]
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def backups(request):
    if request.method == 'GET':
        backups = request.user.backups.all()
        serializer = BackupListSerializer(backups,  many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CreateBackupSerializer(data=request.data)

        if serializer.is_valid():
            path = serializer.validated_data['path']
            note = Note.objects.filter(path=path).first()
            b = Backup(user=request.user, original_path=path, text=note.text)
            b.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        serializer = DeleteBackupSerializer(data=request.data)

        if serializer.is_valid():
            unique_id = serializer.validated_data['unique_id']
            is_backup_exist = request.user.backups.filter(unique_id=unique_id).exists()

            if is_backup_exist:
                b = request.user.backups.filter(unique_id=unique_id).first()
                b.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({
                    "unique_id": [
                        "Backup not founded."
                    ]
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def backup(request, uuid):
    try:
        backup = request.user.backups.get(unique_id=uuid)
    except Backup.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except ValidationError as e:
        return Response({
            "unique_id": e
        }, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        serializer = BackupSerializer(backup)
        return Response(serializer.data)