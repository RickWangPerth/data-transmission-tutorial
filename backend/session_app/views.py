from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_POST

@ensure_csrf_cookie
def csrf_token(request):
    token = get_token(request)
    response = JsonResponse({'csrfToken': token})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

@csrf_protect
@require_POST
def set_session(request):
    key = request.POST.get('key')
    value = request.POST.get('value')
    request.session[key] = value
    response = JsonResponse({'message': 'Session set successfully'})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

@csrf_protect
def get_session(request):
    key = request.GET.get('key')
    value = request.session.get(key)
    response = JsonResponse({'key': key, 'value': value})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response
