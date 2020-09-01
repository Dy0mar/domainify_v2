# -*- coding: utf-8 -*-
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from api.mixins import BaseViewSetMixin, BasePagination

from .models import User
from .serializers import UserSerializer
from .tasks import send_xmpp_message, send_mail_to_user

from django.conf import settings


class UserPagination(BasePagination):

    def get_paginated_response(self, data):
        return Response({
            'page_size': self.page_size,
            'count': self.page.paginator.count,
            'results': data
        })


class UserViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    pagination_class = UserPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(['GET'], detail=False, url_path='all',
            permission_classes=(IsAuthenticated,))
    def list_of_all_users(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({'results': serializer.data})


class CheckNotificationMethod(BaseViewSetMixin, ViewSet):
    def get(self, request, *args, **kwargs):
        check_method = self.request.GET.get('method')

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
