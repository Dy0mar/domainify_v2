from django.db import models
from django.urls import reverse

from users.models import User


class Company(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True, default='')
    address = models.CharField(
        max_length=500, blank=True, null=True, default='')

    def __str__(self):
        return "{}".format(self.name)


class Domain(models.Model):
    ACTIVE = 'ACTIVE'
    EXPIRES_ON = 'EXPIRES_ON'
    TEMPORARY_CLOSED = 'TEMPORARY_CLOSED'
    CLOSED = 'CLOSED'

    DOMAIN_STATUS = (
        (ACTIVE, ACTIVE),
        (EXPIRES_ON, EXPIRES_ON),
        (TEMPORARY_CLOSED, TEMPORARY_CLOSED),
        (CLOSED, CLOSED),
    )

    ALEXA_OFF = 'OFF'
    ALEXA_ON = 'ON'

    ALEXA_STATUS = (
        (ALEXA_OFF, ALEXA_OFF),
        (ALEXA_ON, ALEXA_ON),
    )

    name = models.CharField(max_length=255, unique=True)
    manager = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='manager', default=None)

    use_custom_address = models.BooleanField(default=False)
    custom_company_address = models.CharField(
        max_length=500, blank=True, null=True, default='')

    company = models.ForeignKey(
        Company, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='company')

    alexa_status = models.CharField(
        max_length=255, choices=ALEXA_STATUS, default=ALEXA_OFF)

    alexa_comment = models.CharField(
        max_length=300, blank=True, null=True, default='')

    redirect = models.CharField(
        max_length=255, blank=True, null=True, default='')

    register_date = models.DateField(blank=True, null=True)
    expire_date = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    status = models.CharField(
        max_length=255, choices=DOMAIN_STATUS, default=ACTIVE)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('domain-detail', kwargs={'pk': self.pk})

    class Meta:
        ordering = ['-id']


class Telephone(models.Model):
    domain = models.ForeignKey(
        Domain, on_delete=models.CASCADE, related_name='telephones')
    telephone = models.CharField(
        max_length=255, blank=True, null=True, default='')

    def __str__(self):
        return "{}".format(self.telephone)


class Email(models.Model):
    domain = models.ForeignKey(
        Domain, on_delete=models.CASCADE, related_name='emails')
    email = models.EmailField(blank=True, null=True, default='')

    def __str__(self):
        return "{}".format(self.email)
