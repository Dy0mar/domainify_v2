# -*- coding: utf-8 -*-

from django.urls import path, include
from rest_framework import routers

from domains.views import DomainViewSet, CompanyViewSet
from users.views import UserViewSet
# from domains import views as domains_views
from users import views as users_views
from rest_framework_jwt.views import (
    obtain_jwt_token, refresh_jwt_token, verify_jwt_token
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'domains', DomainViewSet)
router.register(r'companies', CompanyViewSet)

urlpatterns = [
    path(r'users/managers_list/', users_views.managers_list, name='managers-list'),
    # path(r'domains/managers_list/',
    # domains_views.managers_list, name='managers-list'),
    path(r'', include(router.urls)),
    path(r'auth/', include('rest_auth.urls')),

    # auth
    path(r'api-token-auth/', obtain_jwt_token),
    path(r'api-token-refresh/', refresh_jwt_token),
    path(r'api-token-verify/', verify_jwt_token),
]
