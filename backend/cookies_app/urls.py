from django.urls import path
from .views import set_cookie, get_cookie, csrf_token

urlpatterns = [
    path('set-cookie/', set_cookie, name='set_cookie'),
    path('get-cookie/', get_cookie, name='get_cookie'),
    path('csrf-token/', csrf_token, name='csrf_token'),
]
