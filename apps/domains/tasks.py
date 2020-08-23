# -*- coding: utf-8 -*-
import time
import datetime

from django.db.models import Q
from whois import whois
from celery import shared_task

from domains.models import Domain


@shared_task
def auto_update_whois():
    now = datetime.datetime.now().date()
    expire_period = (
        now + datetime.timedelta(days=30)
    )

    qs = Domain.objects.filter(
        Q(register_date__isnull=True) |
        Q(expire_date__isnull=True) |
        Q(
            Q(expire_date__gte=now),
            Q(expire_date__lte=expire_period)
        )
    ).exclude(status=Domain.CLOSED)

    for domain in qs:
        try:
            w = whois(domain.name)
        except Exception:
            continue

        domain.date_register = w.creation_date.date()
        domain.date_expire = w.expiration_date.date()
        domain.save()
        time.sleep(2)


def update(qs, status):
    for domain in qs:
        domain.status = status
        domain.save()


@shared_task
def update_status_domain():
    qs = Domain.objects.filter(
        expire_date__lt=datetime.datetime.now(),
    ).exclude(status=Domain.CLOSED)

    update(qs, Domain.CLOSED)

    qs = Domain.objects.filter(
        expire_date__gt=datetime.datetime.now(),
        status=Domain.CLOSED
    )
    update(qs, Domain.ACTIVE)


