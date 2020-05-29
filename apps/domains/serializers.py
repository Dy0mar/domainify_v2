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


class EmailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = ('pk', 'email', )


class TelephonesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telephone
        fields = ('pk', 'telephone', )


class DomainSerializer(serializers.ModelSerializer):
    telephones = TelephonesSerializer(many=True, required=False)
    emails = EmailsSerializer(many=True, required=False)
    company = CompanySerializer(required=False)
    manager = UserSerializer(required=False)

    class Meta:
        model = Domain
        fields = (
            "url", 'pk', "name", "company", "alexa_status", "emails",
            "telephones", "alexa_comment", "redirect", "register_date",
            "expire_date", "status", "manager", "use_custom_address",
            "custom_company_address",
        )

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

    def get_instance_from_list(self, model, field_plural, field):
        instances = []
        qs = model.objects.filter(domain=self.instance)
        for data in self.initial_data.get(field_plural, []):
            pk = data.get('pk')
            value = data.get(field)
            if pk is None or value is None:
                continue
            try:
                obj = qs.filter(pk=pk).first()
                getattr(obj, field)
                setattr(obj, field, value)
            except AttributeError:
                data = {field: value}
                obj = model(domain=self.instance, **data)
            instances.append(obj)
        return instances or None

    def validate_emails(self, obj):
        instances = self.get_instance_from_list(Email, 'emails', 'email')
        return instances or []

    def validate_telephones(self, obj):
        instances = self.get_instance_from_list(
            Telephone, 'telephones', 'telephone')
        return instances or []

    def create(self, validated_data):
        telephone_data = validated_data.pop('telephones', {})
        email_data = validated_data.pop('emails', {})

        domain = Domain(**validated_data)
        domain.save()
        if telephone_data:
            for telephone in telephone_data:
                telephone.domain = domain
                telephone.save()

        if email_data:
            for email in email_data:
                email.domain = domain
                email.save()
        return domain

    def save_dynamic_objects(self, model, field_plural):
        qs = model.objects.filter(domain=self.instance)
        objects = self.validated_data.get(field_plural, [])
        saved_objects = []
        for obj in objects:
            obj.save()
            saved_objects.append(obj.pk)
        qs.exclude(pk__in=saved_objects).delete()

    def update(self, instance, validated_data):

        self.save_dynamic_objects(Email, 'emails')
        self.save_dynamic_objects(Telephone, 'telephones')

        for key in validated_data.keys():
            if key in ('name', 'emails', 'telephones'):
                continue
            value = validated_data.get(key)
            if getattr(instance, key) != value:
                setattr(instance, key, validated_data.get(key))

        instance.save()

        return instance
