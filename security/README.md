Запуск сервера: `uv run fastapi dev`  
Запуск сервера для тесту CORS: `uv run fastapi dev -e cors:app`  
Запуск сервера для веб частини CORS: `uv run python -m http.server 5500`  
URL веб частини: http://localhost:5500/cors.html
