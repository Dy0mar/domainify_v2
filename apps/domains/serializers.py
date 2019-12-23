# -*- coding: utf-8 -*-
from rest_framework import serializers

from users.models import User
from .models import Domain, Telephone, Email, Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        depth = 1
        fields = ('name', 'address', 'url')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        depth = 1
        fields = ('username', 'url')


class DomainSerializer(serializers.ModelSerializer):
    telephones = serializers.StringRelatedField(many=True)
    emails = serializers.StringRelatedField(many=True)
    company = CompanySerializer()
    manager = UserSerializer()

    class Meta:
        model = Domain
        fields = (
            "url", "name", "company", "alexa_status", "emails", "telephones",
            "alexa_comment", "redirect", "register_date", "expire_date",
            "status", "manager"
        )

        extra_fields = ['pk', 'telephone', 'email']

    def create(self, validated_data):
        telephone_data = validated_data.pop('telephone')
        email_data = validated_data.pop('email')

        domain = Domain(**validated_data)
        Telephone.objects.create(user=domain, **telephone_data)
        Email.objects.create(user=domain, **email_data)
        return domain

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
