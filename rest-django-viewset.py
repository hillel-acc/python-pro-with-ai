# products/serializers.py
from rest_framework import serializers  # базовий модуль серіалізації DRF
from .models import Product  # модель товару


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product  # вказуємо, з якою моделлю працює серіалізатор
        fields = [
            "id",
            "name",
            "price",
        ]  # явно описуємо поля, які дозволено віддавати в API


# products/views.py
from rest_framework.viewsets import ModelViewSet  # готовий CRUD-клас
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(ModelViewSet):
    # queryset визначає, з якими даними працює API
    queryset = Product.objects.all()

    # serializer_class відповідає за JSON і валідацію
    serializer_class = ProductSerializer


# products/urls.py
from rest_framework.routers import DefaultRouter  # router для ViewSet
from .views import ProductViewSet

router = DefaultRouter()  # створюємо router, який автоматично згенерує CRUD-маршрути

router.register("products", ProductViewSet)  # реєструємо ViewSet під шляхом /products/

urlpatterns = router.urls  # підключаємо всі згенеровані URL
