from django.urls import path
from .views import set_cache, get_cache, csrf_token

urlpatterns = [
    path('csrf-token/', csrf_token),
    path('set-cache/', set_cache),
    path('get-cache/', get_cache),
]
