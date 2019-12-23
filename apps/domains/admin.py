from django.contrib import admin
from domains.models import Domain


class DomainItem(admin.ModelAdmin):
    list_display = (
        'name', 'manager', 'created_at'
    )
    list_filter = ('manager',)


admin.site.register(Domain, DomainItem)
