# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import User, UserProfile, UserSettings


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('jabber_nick', )


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ('jabber', 'email', )


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer(required=True)
    settings = UserSettingsSerializer(required=False)

    class Meta:
        model = User
        fields = (
            'pk', 'username', 'email', 'password', 'profile', 'settings'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user, **profile_data)
        UserSettings.objects.create(user=user)
        return user

    def update(self, instance, validated_data):

        email = validated_data.get('email', '')
        if email and email != instance.email:
            instance.email = validated_data.get('email', instance.email)
            instance.save()

        profile_data = validated_data.pop('profile', {})
        if profile_data:
            profile = instance.profile
            profile.jabber_nick = profile_data.get(
                'jabber_nick', profile.jabber_nick
            )
            profile.save()

        settings_data = validated_data.pop('settings', {})
        if settings_data:
            settings = instance.settings
            settings.jabber = settings_data.get('jabber', settings.jabber)
            settings.email = settings_data.get('email', settings.email)
            settings.save()

        return instance
