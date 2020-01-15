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
    # standard codes
    EDIT_SITE_INFO = 'EDIT_SITE_INFO'
    CHANGE_WHOIS = 'CHANGE_WHOIS'
    REMIND_ME = 'REMIND_ME'

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

    def get_notify_message(self):
        code = self.code.code
        msg = f'\nFrom - {self.creator}.'
        if self.domain:
            msg = f'{msg} Domain - {self.domain.name}'

        msg = f'{msg}\n{self.code.name}'
        if self.description:
            msg = f'{msg}\n{self.description}\n'

        if code == Code.EDIT_SITE_INFO:
            if self.domain and self.domain.use_custom_address:
                msg = f'{msg}\n{self.domain.custom_company_address}'
            else:
                msg = f'{msg}\n{self.domain.company.address}\n'

        if code == Code.CHANGE_WHOIS:
            pass
        if code == Code.REMIND_ME:
            pass

        return msg

    def notify_users(self):
        executors = self.executors.all()
        msg = self.get_notify_message()
        for item in executors:
            item.executor.send_message(msg)


class Executor(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='executors')
    executor = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='+', default=None)

    def __str__(self):
        return "{}".format(self.executor)
