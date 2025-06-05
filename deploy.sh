#!/bin/bash

# Investment Dashboard - Deploy Simples
set -e

echo "🚀 Deploying Investment Dashboard..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não instalado"
    exit 1
fi

# Configurar .env se não existir
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "⚠️  Ficheiro .env criado. Configure as APIs antes de continuar."
        echo "   1. Alpha Vantage: https://www.alphavantage.co/support/#api-key"
        echo "   2. API Ninjas: https://api.api-ninjas.com/"
        read -p "Pressione Enter após configurar .env..."
    fi
fi

# Parar containers existentes
docker-compose down 2>/dev/null || true

# Build e start
echo "🔨 Building application..."
docker-compose build

echo "▶️  Starting application..."
docker-compose up -d

# Aguardar start
echo "⏳ Aguardando aplicação iniciar..."
sleep 10

# Verificar se está funcionando
if curl -s -f http://localhost:8080/health &>/dev/null; then
    echo "✅ Dashboard disponível em: http://localhost:8080"
else
    echo "❌ Erro no health check. Verificando logs:"
    docker-compose logs --tail=20
fi
