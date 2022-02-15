from django.contrib import admin
from .models import *

admin.site.register(UserAccount)
admin.site.register(Channel)
admin.site.register(Subscription)
admin.site.register(Video)
admin.site.register(View)
admin.site.register(Like)
admin.site.register(Dislike)
admin.site.register(Comment)
admin.site.register(Category)