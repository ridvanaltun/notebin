import os
import json

from django.http import HttpResponse
from django.core.exceptions import ValidationError
from django.core import mail
from django.contrib.auth.models import update_last_login
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.html import strip_tags
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import *
from .serializers import *
from .functions import seconds_to_left
from .generators import account_activation_token


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


@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
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

    # some fetch clients not support get body like axios
    # therefore we extended the api
    elif request.method == 'POST':
        serializer = NotePasswordSerializer(data=request.data)

        if note.password is None:
            serializer = NoteSerializer(note)
            return Response(serializer.data)

        elif serializer.is_valid():
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


@api_view(['GET'])
def note_has_password(request, path):
    try:
        note = Note.objects.get(path=path)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if note.password:
            return Response('OK')
        else:
            return Response('KO')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def note_info(request, path):
    try:
        note = Note.objects.get(path=path)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        is_user_has_tracking = Tracking.objects.filter(note=note, user=request.user).exists()
        return Response({
            'is_tracked': is_user_has_tracking
        })


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_details(request):
    if request.method == 'GET':
        user_serializer = UserSerializer(request.user)
        backups = request.user.backups.all()
        backups_serializer = BackupListSerializer(backups,  many=True)
        trackings = request.user.trackings.all()
        trackings_serializer = TrackingSerializer(trackings,  many=True)
        return Response({
            'user': user_serializer.data,
            'backups': backups_serializer.data,
            'trackings': trackings_serializer.data
        })


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


@api_view(['POST'])
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
        # save user
        serializer.save(email_verified=False)

        # user
        user = User.objects.get(username=request.data['username'])

        # send registration email
        email_subject = 'Confirm your email at Notebin'
        html_message  = render_to_string('activate_account.html', {
            'user': user,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': account_activation_token.make_token(user),
            'frontend_address': os.environ['FRONTEND_ADDRESS'],
            'time_left': seconds_to_left(os.environ['PASSWORD_RESET_TIMEOUT']),
            'frontend_logo_url': os.environ['FRONTEND_LOGO_URL'],
            'frontend_email_verification_path': os.environ['FRONTEND_EMAIL_VERIFICATION_PATH']
        })
        plain_message = strip_tags(html_message)
        from_email = 'From <' + os.environ['EMAIL_ADDRESS_NO_REPLY'] + '>'
        to_email = request.data['email']
        mail.send_mail(email_subject, plain_message, from_email, [to_email], html_message=html_message)

        # create jwt token for user
        refresh = RefreshToken.for_user(user)

        # serialize user data
        user_serializer = UserSerializer(user)

        return Response({
            "user": user_serializer.data,
            "token": {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

        # return Response({
        #     'detail': 'We have sent you an email, please confirm your email address to complete registration'
        # })
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def activate_email(request):
    if request.method == 'POST':
        serializer = ActivateEmailSerializer(data=request.data)

        if serializer.is_valid():
            try:
                pk = force_bytes(urlsafe_base64_decode((serializer.data.get("pk"))))
                token = serializer.data.get("token")
                user = User.objects.get(pk=pk)
            except(TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user is not None and account_activation_token.check_token(user, token):
                # mark as email activated
                user.email_verified = True
                user.save()

                return Response({'detail': 'Your account has been activate successfully.'})

            else:
                return Response({'detail': 'Activation link is invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def resend_activate_email(request):
    if request.method == 'POST':
        serializer = ResendActivateEmailSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.data.get("email")
            user = User.objects.get(email=email)

            if (user.email_verified):
                return Response({'detail': 'You email address already active.'}, status=status.HTTP_400_BAD_REQUEST)

            # send registration email
            email_subject = 'Confirm your email at Notebin'
            html_message  = render_to_string('activate_account.html', {
                'user': user,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
                'frontend_address': os.environ['FRONTEND_ADDRESS'],
                'time_left': seconds_to_left(os.environ['PASSWORD_RESET_TIMEOUT']),
                'frontend_logo_url': os.environ['FRONTEND_LOGO_URL'],
                'frontend_email_verification_path': os.environ['FRONTEND_EMAIL_VERIFICATION_PATH']
            })
            plain_message = strip_tags(html_message)
            from_email = 'From <' + os.environ['EMAIL_ADDRESS_NO_REPLY'] + '>'
            to_email = request.data['email']
            mail.send_mail(email_subject, plain_message, from_email, [to_email], html_message=html_message)


            return Response({'detail': 'Mail sended.'})

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trackings(request):
    if request.method == 'GET':
        trackings = request.user.trackings.all()
        serializer = TrackingSerializer(trackings,  many=True)
        return Response(serializer.data)


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tracking(request, path):
    try:
        note = Note.objects.filter(path=path).first()
        is_user_has_tracking = Tracking.objects.filter(note=note, user=request.user).exists()
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
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

    elif request.method == 'POST':
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


@api_view(['GET', 'POST'])
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
            serializer = BackupSerializerForCreate(b)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
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

    elif request.method == 'DELETE':
        is_backup_exist = request.user.backups.filter(unique_id=uuid).exists()
        if is_backup_exist:
            b = request.user.backups.filter(unique_id=uuid).first()
            b.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)