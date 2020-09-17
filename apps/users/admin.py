# -*- coding: utf-8 -*-

from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, UserSettings


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


class UserSettingInline(admin.StackedInline):
    model = UserSettings
    can_delete = False


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = (
        'username', 'email', 'jabber_nick', 'is_staff', 'is_superuser',
        'get_groups'
    )

    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    inlines = (UserProfileInline, UserSettingInline)

    def get_groups(self, obj):
        return ', '.join(list(obj.groups.values_list('name', flat=True)))

    get_groups.short_description = 'Groups'

    def jabber_nick(self, x):
        return x.profile.jabber_nick
