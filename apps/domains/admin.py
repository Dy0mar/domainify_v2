from django.contrib import admin
from domains.models import Domain


class DomainItem(admin.ModelAdmin):
    list_display = (
        'name', 'manager', 'company_name', 'created_at'
    )
    list_filter = ('manager',)


admin.site.register(Domain, DomainItem)
