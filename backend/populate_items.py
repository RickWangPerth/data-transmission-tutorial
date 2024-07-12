import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from url_app.models import Item

def add_items():
    items = [
        {"name": "Laptop", "description": "High-performance laptop", "price": 1200.00},
        {"name": "Smartphone", "description": "Latest Android smartphone", "price": 750.00},
        {"name": "Coffee Maker", "description": "Automatic coffee maker", "price": 99.99},
    ]
    for item in items:
        Item.objects.create(**item)
    print("Items added to the database.")

if __name__ == "__main__":
    add_items()