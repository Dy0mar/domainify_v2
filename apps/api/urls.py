# -*- coding: utf-8 -*-

from django.urls import path, include
from rest_framework import routers

from domains.views import DomainViewSet, CompanyViewSet
from tasks import views as tasks_views
from users.views import UserViewSet
from users import views as user_views
from rest_framework_jwt.views import (
    obtain_jwt_token, refresh_jwt_token, verify_jwt_token
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'domains', DomainViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'tasks', tasks_views.TaskViewSet)
router.register(r'statuses', tasks_views.StatusViewSet)
router.register(r'codes', tasks_views.CodeViewSet)

urlpatterns = [
    path(r'users/check-notification-method/',
         user_views.check_notification_method,
         name='check-notification-method'),

    path(r'', include(router.urls)),
    path(r'auth/', include('rest_auth.urls')),

    # auth
    path(r'api-token-auth/', obtain_jwt_token),
    path(r'api-token-refresh/', refresh_jwt_token),
    path(r'api-token-verify/', verify_jwt_token),
]
