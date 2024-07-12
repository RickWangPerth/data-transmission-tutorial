from django.urls import path
from .views import set_session, get_session, csrf_token

urlpatterns = [
    path('set-session/', set_session),
    path('get-session/', get_session),
    path('csrf-token/', csrf_token),
]