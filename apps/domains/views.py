# -*- coding: utf-8 -*-
from django.db.models import F
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.mixins import BaseViewSetMixin, BasePagination
from .models import Domain, Company
from .serializers import DomainSerializer, CompanySerializer


class DomainViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Domain.objects.all()
    serializer_class = DomainSerializer
    pagination_class = BasePagination

    def filter_queryset(self, queryset):
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        params = self.request.query_params

        managers = params.getlist('manager')
        if managers:
            queryset = queryset.filter(manager__pk__in=managers)

        term = params.get('telephones')
        if term and term.isdigit():
            queryset = queryset.filter(telephones__telephone__contains=term)

        term = params.get('name')
        if term:
            queryset = queryset.filter(name__icontains=term)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(['GET'], detail=False, url_path='status-list',
            permission_classes=(IsAuthenticated,))
    def status_list(self, request):
        return Response({'results': Domain.DOMAIN_STATUS})

    @action(['GET'], detail=False, url_path='alexa-status-list',
            permission_classes=(IsAuthenticated,))
    def alexa_status_list(self, request):
        return Response({'results': Domain.ALEXA_STATUS})

    @action(['GET'], url_path='manager-list', detail=False,
            permission_classes=(IsAuthenticated,))
    def manager_list(self, request):
        queryset = self.get_queryset().filter(
            manager__username__isnull=False
        ).annotate(pk=F('manager__pk'), username=F('manager__username')).values(
            'pk', 'username'
        ).order_by('manager__username').distinct()
        r = list(queryset)
        return Response({'results': r})

    @action(detail=False, url_path='search-domain-list',
            permission_classes=(IsAuthenticated,))
    def search_domain_list(self, request):
        query = request.GET.get('term', '').strip()
        queryset = self.get_queryset().filter(
            name__icontains=query
        ).values_list(
            'pk', 'name', 'use_custom_address', 'custom_company_address',
            'company__address', 'company__name',
        )
        return Response({'results': set(queryset)})


class CompanyPagination(BasePagination):
    page_size = 20

    def get_paginated_response(self, data):
        return Response({
            'page_size': self.page_size,
            'count': self.page.paginator.count,
            'results': data
        })


class CompanyViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Company.objects.all().order_by('name')
    serializer_class = CompanySerializer
    pagination_class = CompanyPagination
