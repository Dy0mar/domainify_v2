# -*- coding: utf-8 -*-

from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.mixins import BaseViewSetMixin, BasePagination
from .models import Domain, Company
from .serializers import DomainSerializer, CompanySerializer, ManagerSerializer

from api.permissions import IsLoggedInUserOrAdmin


class DomainViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Domain.objects.all()
    serializer_class = DomainSerializer
    pagination_class = BasePagination

    def filter_queryset(self, queryset):
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        managers = self.request.query_params.getlist('manager')
        if managers:
            queryset = queryset.filter(manager__username__in=managers)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        self.request.query_params.getlist('manager')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CompanyViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    pagination_class = BasePagination


class ManagerViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Domain.objects.filter(
        manager__username__isnull=False
    ).values('manager__username').order_by('manager__username').distinct()


class ManagersList(BaseViewSetMixin, ModelViewSet):
    queryset = Domain.objects.filter(
        manager__username__isnull=False
    ).values_list(
        'manager__username', flat=True
    ).order_by('manager__username').distinct()

    serializer_class = ManagerSerializer
    permission_classes = [IsLoggedInUserOrAdmin]

    def list(self, request, *args, **kwargs):
        return Response(list(self.get_queryset()))


managers_list = ManagersList.as_view({'get': 'list'})
