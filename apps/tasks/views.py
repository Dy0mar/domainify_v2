# -*- coding: utf-8 -*-

from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.mixins import BaseViewSetMixin, BasePagination
from .models import Task, Code, Status
from .serializers import TaskSerializer, CodeSerializer, StatusSerializer


class TaskViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = BasePagination

    def get_queryset(self):
        queryset = self.queryset
        query_set = queryset.filter(creator=self.request.user)
        return query_set

    def filter_queryset(self, queryset):
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        statuses = self.request.query_params.getlist('status.status')
        if statuses:
            queryset = queryset.filter(status__in=statuses)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CodeViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class StatusViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
