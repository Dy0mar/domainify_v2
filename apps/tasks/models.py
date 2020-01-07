from django.db import models

from domains.models import Domain
from users.models import User


class Status(models.Model):
    # standard statuses
    NEW = 'NEW'
    IN_PROGRESS = 'IN_PROGRESS'
    DONE = 'DONE'
    CANCELED = 'CANCELED'

    status = models.CharField(max_length=70, unique=True, default=NEW)
    comment = models.CharField(
        max_length=255, blank=True, null=True, default='')

    def __str__(self):
        return "{}".format(self.status)


class Code(models.Model):
    # standard statuses
    EDIT_SITE_INFO = 'EDIT_SITE_INFO'
    CHANGE_WHOIS = 'CHANGE_WHOIS'
    REMEMBER_ME = 'REMEMBER_ME'

    name = models.CharField(max_length=255, blank=True, null=True, default='')
    code = models.CharField(max_length=70, unique=True, default='')
    comment = models.CharField(
        max_length=255, blank=True, null=True, default='')

    def __str__(self):
        return "{}".format(self.code)


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    creator = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='tasks', default=None)

    domain = models.ForeignKey(
        Domain, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='tasks', default=None)

    status = models.ForeignKey(
        Status, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='tasks', default=Status.NEW)

    code = models.ForeignKey(
        Code, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='tasks', default=Status.NEW)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return "{}".format(self.title)


class Executor(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='executors')
    executor = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='+', default=None)

    def __str__(self):
        return "{}".format(self.executor)
