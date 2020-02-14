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
        fields = ('pk',)

    def to_representation(self, value):

        company_address = value.company.address if value.company else ''
        company_name = value.company.name if value.company else ''

        if value.use_custom_address:
            address = value.custom_company_address
        else:
            address = company_address

        ret = {
            "pk": value.pk,
            "name": value.name,
            "company_name": company_name,
            "use_custom_address": value.use_custom_address,
            "address": address
        }
        return ret


class ExecutorTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Executor
        fields = ('pk', 'executor')

    def to_representation(self, value):
        ret = {
            "executor": value.executor.pk,
            "username": value.executor.username,
        }
        return ret


class TaskSerializer(serializers.ModelSerializer):
    domain = DomainTaskSerializer(required=False)
    status = StatusSerializer(required=False)
    code = CodeSerializer(required=False)
    executors = ExecutorTaskSerializer(required=False, many=True)
    notify = serializers.BooleanField(required=False)

    class Meta:
        model = Task
        fields = (
            "url", "pk", "title", "description", "domain", "status",
            "code", "executors", "notify"
        )

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
        qs = User.objects.filter(pk__in=[x.get('pk') for x in data])
        return list(qs) or []

    def create(self, validated_data):
        executors = validated_data.pop('executors')
        notify = validated_data.pop('notify', False)

        instance = Task(**validated_data)
        instance.creator = self.context['request'].user
        instance.save()
        if executors:
            for executor in executors:
                Executor(task=instance, executor=executor).save()
        if notify:
            instance.notify_users()

        return instance

    def update(self, instance, validated_data):

        executors = validated_data.pop('executors')
        instance.executors.exclude(
            executor__pk__in=[x.pk for x in executors]
        ).delete()

        for executor in executors:
            instance.executors.get_or_create(executor=executor)

        for key in validated_data.keys():
            if key in ('executors', ):
                continue
            value = validated_data.get(key)
            try:
                if getattr(instance, key) != value:
                    setattr(instance, key, validated_data.get(key))
            except AttributeError:
                pass

        instance.save()
        notify = self.validated_data.get('notify', False)
        if notify:
            self.instance.notify_users()

        return instance
