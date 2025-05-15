#!/bin/bash

# Verificar si el script tiene permisos de ejecución
if [ ! -x "$0" ]; then
    echo "Error: Este script no tiene permisos de ejecución."
    echo "Por favor, ejecuta: chmod +x $0"
    exit 1
fi

# Crear volumen si no existe
echo "Creando volumen para la base de datos..."
docker volume create price-scraper-db

# Detener y eliminar el contenedor si existe
if [ $(docker ps -aq -f name=price-scraper) ]; then
  echo "Deteniendo y eliminando contenedor existente..."
  docker stop price-scraper
  docker rm price-scraper
fi

# Construir la imagen (preguntar arquitectura)
echo "¿Qué arquitectura quieres usar para construir la imagen?"
echo "1) ARM64 (para Mac con M1, M2, M3, M4)"
echo "2) AMD64 (para Linux o Windows con Intel/AMD)"
echo "3) Ambas arquitecturas"
read -p "Selecciona una opción (1-3): " arch

case $arch in
  1)
    echo "Construyendo imagen para ARM64..."
    docker buildx build --platform linux/arm64 -t price-scraper .
    ;;
  2)
    echo "Construyendo imagen para AMD64..."
    docker buildx build --platform linux/amd64 -t price-scraper .
    ;;
  3)
    echo "Construyendo imagen para ambas arquitecturas..."
    docker buildx build --platform linux/arm64,linux/amd64 -t price-scraper .
    ;;
  *)
    echo "Opción no válida. Usando ARM64 por defecto."
    docker buildx build --platform linux/arm64 -t price-scraper .
    ;;
esac

# Ejecutar el contenedor CON volumen para la base de datos
echo "Iniciando contenedor con volumen..."
docker run -d --name price-scraper \
  -p 8082:8082 \
  -v price-scraper-db:/app/price_scraper.db \
  price-scraper

# Verificar si la base de datos existe en el volumen
if [ ! -f "$(docker volume inspect price-scraper-db -f '{{.Mountpoint}}')/price_scraper.db" ]; then
  echo "Copiando base de datos inicial al volumen..."
  docker cp database/price_scraper.db price-scraper:/app/price_scraper.db
  echo "Base de datos copiada exitosamente al volumen"
else
  echo "La base de datos ya existe en el volumen, no se realizará la copia inicial"
fi

echo "Configuración completada. El contenedor está corriendo con el volumen configurado."
echo "Puedes acceder a la aplicación en: http://localhost:8082" 