# -*- coding: utf-8 -*-
from rest_framework import serializers

from domains.models import Domain
from users.models import User
from .models import Task, Status, Code, Executor


class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ('pk', 'code', 'name', 'comment')


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ('pk', 'status', 'comment')


class DomainTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ('pk', 'name')


class ExecutorTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Executor
        depth = 1
        fields = ('pk', 'executor')

    def to_representation(self, value):
        ret = {
            "pk": value.pk,
            "username": value.executor.username,
        }
        return ret


class TaskSerializer(serializers.ModelSerializer):
    domain = DomainTaskSerializer(required=False)
    status = StatusSerializer(required=False)
    code = CodeSerializer(required=False)
    executors = ExecutorTaskSerializer(required=False, many=True)

    class Meta:
        model = Task
        fields = (
            "url", "pk", "title", "description", "domain", "status",
            "code", 'executors',
        )
        extra_fields = ['pk']

    def get_instance_from_pk(self, model, field):
        field_data = self.initial_data.get(field)
        if not field_data or not field_data.get('pk'):
            return None
        instance = model.objects.filter(pk=field_data.get('pk')).first()
        return instance or None

    def validate_code(self, obj):
        instance = self.get_instance_from_pk(Code, 'code')
        return instance or None

    def validate_status(self, obj):
        instance = self.get_instance_from_pk(Status, 'status')
        return instance or None

    def validate_domain(self, obj):
        instance = self.get_instance_from_pk(Domain, 'domain')
        return instance or None

    def validate_executors(self, obj):
        data = self.initial_data.get('executors', {})
        qs = User.objects.filter(pk__in=data.get('pk'))
        return list(qs) or []

    def create(self, validated_data):
        executors = validated_data.pop('executors')

        instance = Task(**validated_data)
        instance.creator = self.context['request'].user
        instance.save()
        if executors:
            for executor in executors:
                Executor(task=instance, executor=executor).save()

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
