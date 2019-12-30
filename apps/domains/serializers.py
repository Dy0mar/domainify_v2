# -*- coding: utf-8 -*-
from rest_framework import serializers

from users.models import User
from .models import Domain, Telephone, Email, Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        depth = 1
        fields = ('pk', 'name', 'address', 'url')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        depth = 1
        fields = ('pk', 'username', 'url')


class DomainSerializer(serializers.ModelSerializer):
    telephones = serializers.StringRelatedField(many=True, required=False)
    emails = serializers.StringRelatedField(many=True, required=False)
    company = CompanySerializer(required=False)
    manager = UserSerializer(required=False)

    class Meta:
        model = Domain
        fields = (
            "url", "name", "company", "alexa_status", "emails", "telephones",
            "alexa_comment", "redirect", "register_date", "expire_date",
            "status", "manager"
        )

        extra_fields = ['pk', 'telephone', 'email']

    def get_instance_from_pk(self, model, field):
        field_data = self.initial_data.get(field)
        if not field_data or not field_data.get('pk'):
            return None
        instance = model.objects.filter(pk=field_data.get('pk')).first()
        return instance or None

    def validate_company(self, obj):
        instance = self.get_instance_from_pk(Company, 'company')
        return instance or None

    def validate_manager(self, obj):
        instance = self.get_instance_from_pk(User, 'manager')
        return instance or None

    def create(self, validated_data):
        telephone_data = validated_data.pop('telephone', {})
        email_data = validated_data.pop('email', {})

        domain = Domain(**validated_data)
        domain.save()
        if telephone_data:
            Telephone.objects.create(domain=domain, **telephone_data)
        if email_data:
            Email.objects.create(domain=domain, **email_data)
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


class ManagerSerializer(serializers.ModelSerializer):
    manager = serializers.StringRelatedField(many=True)

    class Meta:
        model = Domain
        fields = ("manager", )
