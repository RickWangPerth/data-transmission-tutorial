from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_POST
import redis
import os

# Connect to Redis
redis_client = redis.StrictRedis(host='redis', port=6379, password=os.getenv('REDIS_PASSWORD'))

@ensure_csrf_cookie
def csrf_token(request):
    token = get_token(request)
    response = JsonResponse({'csrfToken': token})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

@csrf_protect
@require_POST
def set_cache(request):
    key = request.POST.get('key')
    value = request.POST.get('value')
    redis_client.set(key, value)
    response = JsonResponse({'message': 'Cache set successfully'})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

@csrf_protect
def get_cache(request):
    key = request.GET.get('key')
    value = redis_client.get(key)
    response = JsonResponse({'key': key, 'value': value.decode('utf-8') if value else None})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response
