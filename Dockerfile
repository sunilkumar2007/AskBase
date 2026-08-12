FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements-module3.txt .
RUN pip install --no-cache-dir -r requirements-module3.txt

# Copy application source
COPY app/ /app/app/

ENV PYTHONPATH=/app
ENV ENVIRONMENT=production

EXPOSE 8000

CMD ["uvicorn", "app.modules.data_output.router:router", "--host", "0.0.0.0", "--port", "8000"]
