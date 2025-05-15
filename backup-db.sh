#!/bin/bash

# Crear directorio de backups si no existe
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Generar nombre del archivo de backup con fecha
BACKUP_FILE="$BACKUP_DIR/db-backup-$(date +%Y%m%d-%H%M%S).tar.gz"

echo "Iniciando backup de la base de datos..."

# Verificar si el contenedor está corriendo
if [ ! $(docker ps -q -f name=price-scraper) ]; then
    echo "Error: El contenedor price-scraper no está corriendo"
    exit 1
fi

# Verificar si el volumen existe
if [ ! $(docker volume ls -q -f name=price-scraper-db) ]; then
    echo "Error: El volumen price-scraper-db no existe"
    exit 1
fi

# Crear backup del volumen
echo "Creando backup en: $BACKUP_FILE"
docker run --rm \
    -v price-scraper-db:/source \
    -v $(pwd)/$BACKUP_DIR:/backup \
    alpine tar -czf /backup/$(basename $BACKUP_FILE) -C /source .

if [ $? -eq 0 ]; then
    echo "Backup completado exitosamente"
    echo "Archivo de backup: $BACKUP_FILE"
else
    echo "Error al crear el backup"
    exit 1
fi

# Mantener solo los últimos 5 backups
echo "Limpiando backups antiguos..."
ls -t $BACKUP_DIR/db-backup-*.tar.gz | tail -n +6 | xargs -r rm

echo "Proceso de backup finalizado" 