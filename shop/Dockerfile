FROM python:3.14-slim
COPY --from=ghcr.io/astral-sh/uv:trixie-slim /usr/local/bin/uv /usr/local/bin/uvx /usr/local/bin/
# Disable development dependencies
ENV UV_NO_DEV=1
ENV PYTHONUNBUFFERED=1

COPY pyproject.toml uv.lock /app/
WORKDIR /app
RUN uv sync --locked
COPY . .

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
