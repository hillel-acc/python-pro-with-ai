В проекті вказана версія python 3.14  
Встановлення бібліотек: `uv sync`  
Запуск RabbitMQ: `docker compose up`  
Запуск модуля з воркерами: `uv run celery -A tasks worker`  
Moжна вказати кількість воркерів: `uv run celery -A tasks worker -C 1` - один воркер  
Запуск трігера для воркера `process_data`: `uv run python process_data.py`
Запуск трігера для воркера `file_writer`: `uv run python file_writer.py`