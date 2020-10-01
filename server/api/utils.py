import os

from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.html import strip_tags
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string

from .generators import account_activation_token, password_reset_token


# ex: seconds_to_left(359200) -> 3 hours 46 minutes 40 seconds
def seconds_to_left(seconds):
    if type(seconds) == str:
        seconds = int(seconds, 10)
    days = seconds // 86400
    seconds %= 86400
    hours = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60

    result = ''

    if days > 0:
        result = str(days) + ' days'

    if hours > 0:
        if result != '':
            result += ' '
        result += str(hours) + ' hours'

    if minutes > 0:
        if result != '':
            result += ' '
        result += str(minutes) + ' minutes'

    if seconds > 0:
        if result != '':
            result += ' '
        result += str(seconds) + ' seconds'

    return result


# send activation mail
def send_activation_mail(user, to):
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
    mail.send_mail(email_subject, plain_message, from_email, [to], html_message=html_message)


# send reset password mail
def send_reset_password_mail(user, to):
    email_subject = 'Reset your Notebin password'
    html_message  = render_to_string('reset_password.html', {
        'user': user,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': password_reset_token.make_token(user),
        'frontend_address': os.environ['FRONTEND_ADDRESS'],
        'time_left': seconds_to_left(os.environ['PASSWORD_RESET_TIMEOUT']),
        'frontend_logo_url': os.environ['FRONTEND_LOGO_URL'],
        'frontend_reset_password_path': os.environ['FRONTEND_RESET_PASSWORD_PATH']
    })
    plain_message = strip_tags(html_message)
    from_email = 'From <' + os.environ['EMAIL_ADDRESS_NO_REPLY'] + '>'
    mail.send_mail(email_subject, plain_message, from_email, [to], html_message=html_message)