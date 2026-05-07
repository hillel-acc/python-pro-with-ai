RESTful бекенд магазину.

Встановлення залежностей: `uv sync`  
Створення схеми БД: `uv run alembic upgrade head`  
Наповнення БД сутностями: `uv run python seed_db.py`  
Запуск FastAPI сервера: `uv run uvicorn app:app --reload`

Теги (git checkout <tag_name>):
* shop-with-cart-and-stripe - з заняття про корзину та Страйп
* async-endpoints-and-sqlalchemy - асинхронні ендпойнти + запити до БД

Поточна версія - спроба зберігати корзину в Редіс
Додано pytest-based тест та Github actions workflow
