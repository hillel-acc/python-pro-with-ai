# orders/serializers.py
from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order  # модель замовлення
        fields = [
            "id",
            "customer",
            "total_price",
        ]  # контролюємо, які поля можна передавати з клієнта


# orders/views.py
from rest_framework.generics import CreateAPIView  # generic для POST
from .models import Order
from .serializers import OrderSerializer


class OrderCreateAPIView(CreateAPIView):
    # queryset потрібен DRF для роботи з БД
    queryset = Order.objects.all()

    # серіалізатор відповідає за валідацію і створення обʼєкта
    serializer_class = OrderSerializer


# orders/urls.py
from django.urls import path
from .views import OrderCreateAPIView

urlpatterns = [
    # маршрут для створення замовлення
    path("orders/create/", OrderCreateAPIView.as_view()),
]
