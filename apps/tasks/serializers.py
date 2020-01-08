# -*- coding: utf-8 -*-
from rest_framework import serializers

from domains.serializers import DomainSerializer
from users.serializers import UserSerializer
from .models import Task, Status, Code


class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ('pk', 'code', 'comment')


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ('pk', 'status', 'comment')


class TaskSerializer(serializers.ModelSerializer):
    domain = DomainSerializer(required=False)
    creator = UserSerializer(required=False)
    status = StatusSerializer(required=False)
    code = CodeSerializer(required=False)

    class Meta:
        model = Task
        fields = (
            "url", "title", "description", "creator", "domain", "status", "code"
        )

        extra_fields = ['pk']

    def create(self, validated_data):
        telephone_data = validated_data.pop('telephones', {})
        email_data = validated_data.pop('emails', {})

        instance = Task(**validated_data)
        instance.save()
        if telephone_data:
            for telephone in telephone_data:
                telephone.domain = instance
                telephone.save()

        if email_data:
            for email in email_data:
                email.domain = instance
                email.save()
        return instance

    def save_dynamic_objects(self, model, field_plural):
        qs = model.objects.filter(domain=self.instance)
        objects = self.validated_data.get(field_plural, [])
        saved_objects = []
        for obj in objects:
            obj.save()
            saved_objects.append(obj.pk)
        qs.exclude(pk__in=saved_objects).delete()

    def update(self, instance, validated_data):

        for key in validated_data.keys():
            if key in ('name', 'emails', 'telephones'):
                continue
            value = validated_data.get(key)
            if getattr(instance, key) != value:
                setattr(instance, key, validated_data.get(key))

        instance.save()

        return instance
