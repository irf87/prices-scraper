#!/bin/bash

# Verificar si se proporcionó un archivo de backup
if [ -z "$1" ]; then
    echo "Error: Debes especificar un archivo de backup"
    echo "Uso: ./restore-db.sh <archivo-de-backup>"
    echo "Ejemplo: ./restore-db.sh ./backups/db-backup-20240315-120000.tar.gz"
    exit 1
fi

BACKUP_FILE=$1

# Verificar si el archivo de backup existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: El archivo de backup no existe: $BACKUP_FILE"
    exit 1
fi

echo "Iniciando restauración de la base de datos..."

# Verificar si el contenedor está corriendo
if [ $(docker ps -q -f name=price-scraper) ]; then
    echo "Deteniendo el contenedor price-scraper..."
    docker stop price-scraper
    docker rm price-scraper
fi

# Verificar si el volumen existe
if [ ! $(docker volume ls -q -f name=price-scraper-db) ]; then
    echo "Creando volumen price-scraper-db..."
    docker volume create price-scraper-db
fi

# Restaurar el backup
echo "Restaurando backup desde: $BACKUP_FILE"
docker run --rm \
    -v price-scraper-db:/target \
    -v $(pwd):/backup \
    alpine sh -c "rm -rf /target/* && tar -xzf /backup/$(basename $BACKUP_FILE) -C /target"

if [ $? -eq 0 ]; then
    echo "Restauración completada exitosamente"
else
    echo "Error al restaurar el backup"
    exit 1
fi

# Reiniciar el contenedor
echo "Reiniciando el contenedor..."
docker run -d --name price-scraper \
    -p 8082:8082 \
    -v price-scraper-db:/app/price_scraper.db \
    price-scraper

echo "Proceso de restauración finalizado"
echo "Puedes acceder a la aplicación en: http://localhost:8082" 