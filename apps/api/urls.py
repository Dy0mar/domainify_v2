# -*- coding: utf-8 -*-

from django.urls import path, include
from rest_framework import routers

from domains.views import DomainViewSet, CompanyViewSet
from tasks import views as tasks_views
from users.views import UserViewSet
from domains import views as domains_views
from rest_framework_jwt.views import (
    obtain_jwt_token, refresh_jwt_token, verify_jwt_token
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'domains', DomainViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'tasks', tasks_views.TaskViewSet)

urlpatterns = [
    path(r'users/manager_list/',
         domains_views.manager_list, name='manager-list'),
    path(r'domains/status_list/',
         domains_views.status_list, name='status-list'),
    path(r'domains/alexa_status_list/',
         domains_views.alexa_status_list, name='alexa-status-list'),
    path(r'tasks/codes_list/',
         tasks_views.codes_list, name='tasks-codes-list'),
    path(r'tasks/status_list/',
         tasks_views.status_list, name='tasks-status-list'),

    path(r'', include(router.urls)),
    path(r'auth/', include('rest_auth.urls')),

    # auth
    path(r'api-token-auth/', obtain_jwt_token),
    path(r'api-token-refresh/', refresh_jwt_token),
    path(r'api-token-verify/', verify_jwt_token),
]

