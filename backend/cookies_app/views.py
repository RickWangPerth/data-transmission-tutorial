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
def set_cookie(request):
    key = request.POST.get('key')
    value = request.POST.get('value')
    print(f"Set Cookie - Key: {key}, Value: {value}")
    response = JsonResponse({'message': 'Cookie set successfully'})
    response.set_cookie(key, value)
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    print(f"Response Cookies: {response.cookies}")
    return response

@csrf_protect
@require_POST
def get_cookie(request):
    key = request.POST.get('key')
    value = request.COOKIES.get(key, None)
    print(f"Get Cookie - Key: {key}, Value: {value}")
    response = JsonResponse({'key': key, 'value': value})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response
