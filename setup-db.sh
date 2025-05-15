#!/bin/bash

# Detener y eliminar el contenedor si existe
if [ $(docker ps -aq -f name=price-scraper) ]; then
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

# Ejecutar el contenedor SIN volumen para la base de datos
docker run -d --name price-scraper -p 8082:8082 price-scraper

# Copiar la base de datos al contenedor
docker cp database/price_scraper.db price-scraper:/app/price_scraper.db

echo "Base de datos copiada exitosamente al contenedor" 