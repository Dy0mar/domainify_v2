# -*- coding: utf-8 -*-

from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from api.mixins import BaseViewSetMixin, BasePagination
from .models import Task, Code, Status
from .serializers import TaskSerializer, CodeSerializer, StatusSerializer


class TaskViewSet(BaseViewSetMixin, ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = BasePagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CodeList(BaseViewSetMixin, ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class StatusList(BaseViewSetMixin, ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


codes_list = CodeList.as_view({'get': 'list'})
status_list = StatusList.as_view({'get': 'list'})
