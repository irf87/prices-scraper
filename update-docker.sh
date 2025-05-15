#!/bin/bash

# Verificar si el script tiene permisos de ejecución
if [ ! -x "$0" ]; then
    echo "Error: Este script no tiene permisos de ejecución."
    echo "Por favor, ejecuta: chmod +x $0"
    exit 1
fi

# Verificar si existe el script de backup
if [ ! -f "./backup-db.sh" ]; then
    echo "Error: No se encuentra el script de backup (backup-db.sh)"
    exit 1
fi

# Verificar si existe el script de setup
if [ ! -f "./setup-docker.sh" ]; then
    echo "Error: No se encuentra el script de setup (setup-docker.sh)"
    exit 1
fi

# Hacer backup antes de actualizar
echo "Creando backup de la base de datos antes de actualizar..."
./backup-db.sh

if [ $? -ne 0 ]; then
    echo "Error: No se pudo crear el backup. Abortando actualización."
    exit 1
fi

# Stop current container
echo "Deteniendo contenedor actual..."
docker stop price-scraper 2>/dev/null

# Remove old container
echo "Eliminando contenedor antiguo..."
docker rm price-scraper 2>/dev/null

# Pull latest changes
echo "Obteniendo últimos cambios..."
git pull

# Detect architecture and build accordingly
if [[ $(uname -m) == 'arm64' ]]; then
    echo "Construyendo para ARM64 (M1/M2/M3/M4)..."
    docker buildx build --platform linux/arm64 -t price-scraper .
else
    echo "Construyendo para x86_64 (Intel/AMD)..."
    docker buildx build --platform linux/amd64 -t price-scraper .
fi

# Verificar si el volumen existe
if [ ! $(docker volume ls -q -f name=price-scraper-db) ]; then
    echo "Creando volumen price-scraper-db..."
    docker volume create price-scraper-db
fi

# Use .env if exists, otherwise use env
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    ENV_FILE="env"
fi

# Start new container with volume
echo "Iniciando nuevo contenedor con volumen..."
docker run -d --name price-scraper \
    --env-file $ENV_FILE \
    -p 8082:8082 \
    -v price-scraper-db:/app/price_scraper.db \
    price-scraper

echo "Actualización completada"
echo "Puedes acceder a la aplicación en: http://localhost:8082"
echo "Recuerda: La base de datos se mantiene en el volumen price-scraper-db" 