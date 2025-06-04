#!/bin/bash
# Script de build para produção - Dashboard de Investimentos

echo "🔨 Iniciando build da aplicação para produção..."

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar e atualizar configuração de APIs
echo "🔄 Atualizando configuração de APIs..."
node api-integration.js

# Build para produção
echo "🏗️ Building para produção..."
npm run build

echo "✅ Build concluído com sucesso!"

# Preparar para Docker
echo "🐳 Preparando build para Docker..."
cp .env.example .env.production
echo "NODE_ENV=production" >> .env.production
echo "PORT=8080" >> .env.production

echo "📝 Configuração de produção criada: .env.production"
echo "💡 Execute 'docker-compose up -d' para iniciar a aplicação"
