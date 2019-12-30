# -*- coding: utf-8 -*-

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ViewSet

from api.mixins import BaseViewSetMixin, BasePagination
from .models import Domain, Company
from .serializers import DomainSerializer, CompanySerializer

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
            queryset = queryset.filter(manager__pk__in=managers)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

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
    ).values_list(
        'manager__pk', 'manager__username'
    ).order_by('manager__username').distinct()

    def list(self, request, *args, **kwargs):
        data = list(self.get_queryset())
        return Response(data)


class StatusList(BaseViewSetMixin, ViewSet):
    def list(self, request, *args, **kwargs):
        return Response(list(Domain.DOMAIN_STATUS))


class AlexaStatusList(BaseViewSetMixin, ViewSet):
    def list(self, request, *args, **kwargs):
        return Response(list(Domain.ALEXA_STATUS))


class CompanyList(BaseViewSetMixin, ModelViewSet):
    queryset = Company.objects.all()

    serializer_class = CompanySerializer
    permission_classes = [IsLoggedInUserOrAdmin]

    # def list(self, request, *args, **kwargs):
    #     return Response(list(self.get_queryset()))


status_list = StatusList.as_view({'get': 'list'})
alexa_status_list = AlexaStatusList.as_view({'get': 'list'})
company_list = CompanyList.as_view({'get': 'list'})
manager_list = ManagerViewSet.as_view({'get': 'list'})
