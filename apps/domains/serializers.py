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


class DomainSerializer(serializers.ModelSerializer):
    telephones = serializers.StringRelatedField(many=True, required=False)
    emails = EmailsSerializer(many=True, required=False)
    company = CompanySerializer(required=False)
    manager = UserSerializer(required=False)

    class Meta:
        model = Domain
        fields = (
            "url", "name", "company", "alexa_status", "emails", "telephones",
            "alexa_comment", "redirect", "register_date", "expire_date",
            "status", "manager", "use_custom_address", "custom_company_address",
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

    def get_instance_from_list(self, model, field_plural, field):
        instances = []
        qs = model.objects.filter(domain=self.instance)
        for data in self.initial_data.get(field_plural, []):
            pk = data.get('pk')
            data_field = data.get(field)
            if not all([pk, data_field]):
                continue
            try:
                obj = qs.filter(pk=pk).first()
                obj.email = data_field
            except AttributeError:
                obj = Email(domain=self.instance, email=data_field)
            instances.append(obj)
        return instances or None

    def validate_emails(self, obj):
        instances = self.get_instance_from_list(Email, 'emails', 'email')
        return instances or []

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
        qs = Email.objects.filter(domain=instance)

        emails = validated_data.get('emails', [])
        clear_objects = []
        for obj in emails:
            obj.save()
            clear_objects.append(obj.pk)
        qs.exclude(pk__in=clear_objects).delete()

        for key in validated_data.keys():
            if key in ('name', 'emails', 'telephones'):
                continue
            value = validated_data.get(key)
            if getattr(instance, key) != value:
                setattr(instance, key, validated_data.get(key))

        instance.save()

        return instance


class ManagerSerializer(serializers.ModelSerializer):
    manager = serializers.StringRelatedField(many=True)

    class Meta:
        model = Domain
        fields = ("manager", )
