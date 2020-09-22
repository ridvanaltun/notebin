import uuid
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

alphanumeric = RegexValidator(r'^[a-zA-Z]+[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed. First character can not be digit.')

class User(AbstractUser):
    username = models.CharField(max_length=30, unique=True, validators=[alphanumeric])
    email = models.EmailField(max_length=254, null=False, blank=False, unique=True)
    email_updates = models.BooleanField(default=True)


class Note(models.Model):
    text = models.TextField(default="", blank=True)
    path = models.CharField(max_length=50, default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    password = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.text


class Tracking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trackings")
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="trackings")


class Backup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="backups")
    text = models.TextField(default="")
    unique_id = models.UUIDField(max_length=50, default=uuid.uuid4, unique=True, editable=False)
    original_path = models.CharField(max_length=50, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
