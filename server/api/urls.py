from django.urls import path
from django.conf.urls import url
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from . import views


urlpatterns = [
    path("notes", views.notes, name="notes"),
    path("notes/<str:path>", views.note, name="note"),
    path("notes/<str:path>/hasPassword", views.note_has_password, name="note-has-password"),
    path("notes/<str:path>/password", views.note_password, name="note-password"),
    path('token', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify', TokenVerifyView.as_view(), name='token-verify'),
    path('me', views.me, name='me'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('register', views.register, name='register'),
    path('password', views.password, name='password'),
    path('trackings', views.trackings, name='trackings'),
    path('trackings/<str:path>', views.tracking, name='tracking'),
    path('backups', views.backups, name='backups'),
    path('backups/<str:uuid>', views.backup, name='backup'),
]
