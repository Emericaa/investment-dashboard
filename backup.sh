#!/bin/bash
# Script de backup para Dashboard de Investimentos

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="dashboard_backup_$DATE.tar.gz"

echo "💾 Iniciando backup do Dashboard..."

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup dos volumes
echo "📁 Backup dos volumes..."
docker run --rm \
    -v investment-dashboard_dashboard-logs:/data/logs \
    -v investment-dashboard_dashboard-cache:/data/cache \
    -v $(pwd)/$BACKUP_DIR:/backup \
    alpine tar czf /backup/volumes_$DATE.tar.gz /data

# Backup dos ficheiros de configuração
echo "⚙️  Backup da configuração..."
tar czf $BACKUP_DIR/config_$DATE.tar.gz \
    .env \
    docker-compose.yml \
    Dockerfile \
    nginx.conf \
    package.json

echo "✅ Backup concluído: $BACKUP_DIR/"
echo "📁 Ficheiros criados:"
ls -la $BACKUP_DIR/*$DATE*
