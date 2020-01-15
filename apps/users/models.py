# -*- coding: utf-8 -*-
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from users.tasks import send_xmpp_message, send_mail_to_user


class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_(
            'Required. 150 characters or fewer. '
            'Letters, digits and @/./+/-/_ only.'
        ),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
        null=True
    )

    email = models.EmailField(_('email address'), blank=False)

    def __str__(self):
        return "{}".format(self.username)

    def send_message(self, msg):
        if self.settings.jabber:
            send_xmpp_message.apply_async((self.profile.jabber_nick, msg))

        if self.settings.email:
            send_mail_to_user.apply_async(
                ('Domainify BOT', msg, settings.EMAIL_HOST_USER, [self.email])
            )


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    jabber_nick = models.CharField(max_length=255, blank=True)


class UserSettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='settings'
    )

    jabber = models.BooleanField(default=True)
    email = models.BooleanField(default=False)

    def __str__(self):
        return 'Settings for {}'.format(self.user)
