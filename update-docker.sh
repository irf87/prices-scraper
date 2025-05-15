#!/bin/bash

# Stop current container
echo "Stopping current container..."
docker stop $(docker ps -q)

# Remove old container
echo "Removing old container..."
docker rm $(docker ps -aq)

# Pull latest changes
echo "Pulling latest changes..."
git pull

# Detect architecture and build accordingly
if [[ $(uname -m) == 'arm64' ]]; then
    echo "Building for ARM64 (M1/M2/M3/M4)..."
    docker buildx build --platform linux/arm64 -t prices-scraper .
else
    echo "Building for x86_64 (Intel/AMD)..."
    docker buildx build --platform linux/amd64 -t prices-scraper .
fi

# Remove and recreate Docker volume to avoid file/directory conflicts
echo "Removing old database volume (if exists)..."
docker volume rm price-scraper-db 2>/dev/null

echo "Setting up database volume..."
docker volume create price-scraper-db

echo "Recuerda: el archivo price_scraper.db ya no se copia al contenedor, solo se usa el volumen."

# Use .env if exists, otherwise use env
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE="env"
fi

# Start new container with volume
echo "Starting new container..."
docker run --env-file $ENV_FILE -p 8082:8082 -v price-scraper-db:/app/price_scraper.db prices-scraper 