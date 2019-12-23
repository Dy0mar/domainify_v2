# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Domain, Telephone, Email


class TelephoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telephone
        fields = ('telephone', )


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = ('email', )


class DomainSerializer(serializers.HyperlinkedModelSerializer):
    profile = TelephoneSerializer(required=False)
    settings = EmailSerializer(required=False)

    class Meta:
        model = Domain
        fields = '__all__'

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
