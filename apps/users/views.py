# -*- coding: utf-8 -*-
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import AllowAny

from api.permissions import IsLoggedInUserOrAdmin, IsAdminUser
from api.mixins import BaseViewSetMixin

from .models import User
from .serializers import UserSerializer
from .tasks import send_xmpp_message, send_mail_to_user

from django.conf import settings


class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class UserViewSet(ModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    pagination_class = UserPagination

    def get_permissions(self):
        permission_classes = []

        if self.action == 'create':
            permission_classes = [AllowAny]

        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [IsLoggedInUserOrAdmin]

        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]


class CheckNotificationMethod(BaseViewSetMixin, ViewSet):
    def get(self, request, *args, **kwargs):
        check_method = request.GET.get('method')

        if check_method == 'email' and request.user.email:
            subject = 'Domainify BOT - Check ok'
            message = 'If you are reading this letter then check is success'
            from_email = settings.EMAIL_HOST_USER

            send_mail_to_user.apply_async(
                (subject, message, from_email, [request.user.email])
            )
        if check_method == 'jabber' and request.user.profile.jabber_nick:
            send_xmpp_message.apply_async(
                (request.user.profile.jabber_nick, 'Check ok =]')
            )
        return Response('Message has been sent')


check_notification_method = CheckNotificationMethod.as_view({'get': 'get'})
