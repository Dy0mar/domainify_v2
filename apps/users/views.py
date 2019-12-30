# -*- coding: utf-8 -*-
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.mixins import BaseViewSetMixin
from .models import User
from .serializers import UserSerializer

from rest_framework.permissions import AllowAny
from api.permissions import IsLoggedInUserOrAdmin, IsAdminUser


class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
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


class ManagerList(BaseViewSetMixin, ModelViewSet):
    queryset = User.objects.filter(
        is_staff=True, is_superuser=False
    ).values_list('pk', 'username',)

    serializer_class = UserSerializer
    permission_classes = [IsLoggedInUserOrAdmin]

    def list(self, request, *args, **kwargs):
        return Response(list(self.get_queryset()))


manager_list = ManagerList.as_view({'get': 'list'})
