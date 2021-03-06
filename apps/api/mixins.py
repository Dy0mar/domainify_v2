# -*- coding: utf-8 -*-
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny

from api.permissions import IsLoggedInUserOrAdmin, IsAdminUser


class BasePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class BaseViewSetMixin:
    def get_permissions(self):
        permission_classes = []

        if self.action == 'create':
            permission_classes = [AllowAny]

        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [IsLoggedInUserOrAdmin]

        elif self.action == 'list' or self.action == 'destroy':
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]
