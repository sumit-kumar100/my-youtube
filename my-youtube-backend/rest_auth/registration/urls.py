from django.views.generic import TemplateView
from django.conf.urls import url
from django.urls import re_path

from .views import RegisterView , VerifyEmailView , ConfirmEmailView

urlpatterns = [
    url(r'^$', RegisterView.as_view(), name='rest_register'),
    re_path(r'^account-confirm-email/', VerifyEmailView.as_view(),name='account_email_verification_sent'),
    url(r'^rest-auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$', ConfirmEmailView.as_view(), name='account_confirm_email'),
]
