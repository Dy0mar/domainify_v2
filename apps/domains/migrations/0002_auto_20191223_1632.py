# Generated by Django 2.2.8 on 2019-12-23 16:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('domains', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='domain',
            old_name='company_address',
            new_name='custom_company_address',
        ),
        migrations.RemoveField(
            model_name='domain',
            name='company_name',
        ),
        migrations.AlterField(
            model_name='email',
            name='domain',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='emails', to='domains.Domain'),
        ),
        migrations.AlterField(
            model_name='telephone',
            name='domain',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='telephones', to='domains.Domain'),
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('address', models.CharField(blank=True, default='', max_length=500, null=True)),
                ('domain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company', to='domains.Domain')),
            ],
        ),
    ]
