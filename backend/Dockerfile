FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PATH="/app/.venv/bin:$PATH"

COPY requirements.txt .
RUN python -m pip install --upgrade pip setuptools wheel && pip install -r requirements.txt

COPY . .

EXPOSE 8080
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8080"]
