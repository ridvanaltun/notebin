from django.contrib import admin

from .models import User, Note,  Tracking, Backup


class UserAdmin(admin.ModelAdmin):
    list_display = ("username", 'date_joined', 'last_login')


class NoteAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at", "updated_at", "text", "path", "password")


class TrackingAdmin(admin.ModelAdmin):
    list_display = ("note", "user")


class BackupAdmin(admin.ModelAdmin):
    list_display = ("unique_id", "user", "text", "original_path", "created_at", "updated_at")


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(Tracking, TrackingAdmin)
admin.site.register(Backup, BackupAdmin)