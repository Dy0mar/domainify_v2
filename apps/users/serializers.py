# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import User, UserProfile, UserSettings


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('pidgin', )


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ('pidgin', 'email', )


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer(required=True)
    settings = UserSettingsSerializer(required=False)

    class Meta:
        model = User
        fields = (
            'email', 'first_name', 'last_name', 'password', 'profile',
            'settings'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        settings_data = validated_data.pop('settings')
        settings = instance.settings

        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.pidgin = profile_data.get('pidgin', profile.pidgin)
        profile.save()

        settings.pidgin = settings_data.get('pidgin', settings.pidgin)
        settings.email = settings_data.get('email', settings.email)

        return instance
