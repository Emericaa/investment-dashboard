#!/bin/bash
# Script de deployment para Dashboard de Investimentos
set -e

echo "🚀 Iniciando deployment do Dashboard de Investimentos..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Ficheiro .env não encontrado. Copiando template..."
    cp .env.example .env
    echo "📝 Por favor configure as suas chaves API no ficheiro .env"
    echo "🔧 Edite o ficheiro .env e execute novamente este script"
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down || true

# Build da nova imagem
echo "🔨 Building nova imagem..."
docker-compose build --no-cache

# Iniciar aplicação
echo "▶️  Iniciando aplicação..."
docker-compose up -d

# Aguardar health check
echo "⏳ Aguardando aplicação ficar pronta..."
sleep 30

# Verificar se está a funcionar
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Dashboard deployment concluído com sucesso!"
    echo "🌐 Aceda a: http://localhost:8080"
    echo "🏥 Health check: http://localhost:8080/health"
else
    echo "❌ Falha no health check. Verificando logs..."
    docker-compose logs investment-dashboard
    exit 1
fi

# Mostrar status
echo "📊 Status dos containers:"
docker-compose ps
