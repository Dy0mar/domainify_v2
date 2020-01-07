from django.contrib import admin
from tasks.models import Task, Code, Status


class TaskItem(admin.ModelAdmin):
    list_display = (
        'title', 'creator', 'status', 'code'
    )
    list_filter = ('status', 'code', 'creator', )


class CodeItem(admin.ModelAdmin):
    list_display = (
        'name', 'code', 'comment',
    )
    list_filter = ('code', )


class StatusItem(admin.ModelAdmin):
    list_display = (
        'status', 'comment',
    )
    list_filter = ('status', )


admin.site.register(Task, TaskItem)
admin.site.register(Code, CodeItem)
admin.site.register(Status, StatusItem)
