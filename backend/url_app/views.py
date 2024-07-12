from django.shortcuts import render
from django.http import JsonResponse
from .models import Item

def item_list(request):
    name = request.GET.get('name', '')
    price = request.GET.get('price', '')
    items = Item.objects.all()

    if name:
        items = items.filter(name__icontains=name)
    if price:
        items = items.filter(price__lte=price)

    items_data = [{"id": item.id, "name": item.name, "price": item.price} for item in items]
    return JsonResponse(items_data, safe=False)
