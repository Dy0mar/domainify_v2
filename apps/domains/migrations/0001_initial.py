# Generated by Django 2.2.8 on 2019-12-23 10:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Domain',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('company_name', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('company_address', models.CharField(blank=True, default='', max_length=500, null=True)),
                ('alexa_status', models.CharField(choices=[('OFF', 'OFF'), ('ON', 'ON')], default='OFF', max_length=255)),
                ('alexa_comment', models.CharField(blank=True, default='', max_length=300, null=True)),
                ('redirect', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('register_date', models.DateField(blank=True, null=True)),
                ('expire_date', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('ACTIVE', 'ACTIVE'), ('EXPIRES_ON', 'EXPIRES_ON'), ('TEMPORARY_CLOSED', 'TEMPORARY_CLOSED'), ('CLOSED', 'CLOSED')], default='ACTIVE', max_length=255)),
                ('manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='manager', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Telephone',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('telephone', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('domain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='domains.Domain')),
            ],
        ),
        migrations.CreateModel(
            name='Email',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(blank=True, default='', max_length=254, null=True)),
                ('domain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='domains.Domain')),
            ],
        ),
    ]
