# -*- coding: utf-8 -*-

from django.urls import path, include
from rest_framework import routers

from domains.views import DomainViewSet, CompanyViewSet
from tasks import views as tasks_views
from users.views import UserViewSet
from users import views as user_views

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
]
