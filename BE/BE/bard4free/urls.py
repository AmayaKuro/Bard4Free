from django.urls import path, re_path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

from bard4free import views


urlpatterns = [
    re_path('register', views.register),
    re_path('login', views.UserAndTokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path('signout', TokenBlacklistView.as_view(), name='token_blacklist'),
    re_path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    re_path('conversation', views.requestConversation, name='conversations'),
    re_path('response', views.requestResponse, name='responses'),
]