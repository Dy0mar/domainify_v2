# -*- coding: utf-8 -*-

from django.urls import path, include
from rest_framework import routers
from users.views import UserViewSet
from rest_framework_jwt.views import (
    obtain_jwt_token, refresh_jwt_token, verify_jwt_token
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'auth/', include('rest_auth.urls')),

    # auth
    path(r'api-token-auth/', obtain_jwt_token),
    path(r'api-token-refresh/', refresh_jwt_token),
    path(r'api-token-verify/', verify_jwt_token),
]
