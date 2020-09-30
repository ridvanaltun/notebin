from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate, get_user_model

from .models import User, Note, Tracking, Backup


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        max_length=128,
        write_only=True
    )

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise AuthenticationFailed(msg)

            # elif not user.email_verified:
            #     msg = 'Email address not verified.'
            #     raise AuthenticationFailed(msg)

        else:
            msg = 'Must include "username" and "password".'
            raise serializers.ValidationError(msg)

        data['user'] = user
        return data


class NoteSerializer(serializers.ModelSerializer):
    has_password = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = ['id', 'text', 'created_at', 'updated_at', 'path', 'has_password']

    def get_has_password(self, obj):
        if obj.password is None:
            return False
        else:
            return True


class NoteListSerializer(serializers.ModelSerializer):
    has_password = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = ['id', 'created_at', 'updated_at', 'path', 'has_password']

    def get_has_password(self, obj):
        if obj.password is None:
            return False
        else:
            return True


class NotePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)


class ActivateEmailSerializer(serializers.Serializer):
    pk = serializers.CharField(required=True)
    token = serializers.CharField(required=True)


class ResendActivateEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class CreateNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['path', 'text']


class UserSerializer(serializers.ModelSerializer):
    last_login = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'last_login', 'email_updates', 'email_verified']


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'email_updates']
        extra_kwargs = {
            'username': {'required': True, 'allow_blank': False},
            'password': {'required': True, 'allow_blank': False},
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'email': {'required': True, 'allow_blank': False}
        }

    def validate_password(self, value):
        validate_password(value)
        hashed_password = make_password(value)
        return hashed_password


class TrackingSerializer(serializers.ModelSerializer):
    note = NoteListSerializer()

    class Meta:
        model = Tracking
        fields = ['note']


class BackupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Backup
        fields = ['text', 'created_at', 'updated_at', 'original_path', 'unique_id']


class BackupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Backup
        fields = ['created_at', 'updated_at', 'original_path', 'unique_id']


class BackupSerializerForCreate(serializers.ModelSerializer):
    class Meta:
        model = Backup
        fields = ['created_at', 'updated_at', 'original_path', 'unique_id']


class CreateBackupSerializer(serializers.Serializer):
    path = serializers.CharField(required=True)

    def validate_path(self, value):
        """
        Check that the path is exists
        """
        n = Note.objects.filter(path=value).exists()

        if n is False:
            raise serializers.ValidationError("Note not exists.")

        return value
