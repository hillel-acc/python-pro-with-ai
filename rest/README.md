RESTful бекенд магазину.

Встановлення залежностей: `uv sync`  
Створення схеми БД: `uv run alembic upgrade head`  
Наповнення БД сутностями: `uv run python seed_db.py`  
Запуск FastAPI сервера: `uv run uvicorn app:app --reload` (--reload флаг дозволяє редагувати код та бачити зміни без перезапуску сервера)  