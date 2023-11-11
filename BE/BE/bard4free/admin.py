from django.contrib import admin

from .models import User, Conversations, Responses

admin.site.register(User)
admin.site.register(Conversations)
admin.site.register(Responses)
