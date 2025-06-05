# Dockerfile Simplificado para Investment Dashboard
# Apenas Node.js + Express para uso local
FROM node:18-alpine

# Criar utilizador não-root
RUN addgroup -g 1001 -S dashuser &&     adduser -S dashuser -u 1001 -G dashuser

# Instalar curl para health checks
RUN apk add --no-cache curl

# Definir diretório de trabalho
WORKDIR /app

# Copiar ficheiros de dependências primeiro (para cache)
COPY package*.json ./

# Instalar dependências com fallback para npm ci
RUN if [ -f package-lock.json ]; then       npm ci --omit=dev;     else       npm install --package-lock-only && npm ci --omit=dev;     fi

# Copiar código da aplicação
COPY . .

# Criar directórios necessários
RUN mkdir -p public data

# Definir permissões
RUN chown -R dashuser:dashuser /app
USER dashuser

# Expor porta 8080
EXPOSE 8080

# Health check simples
HEALTHCHECK --interval=30s --timeout=3s --retries=3   CMD curl -f http://localhost:8080/health || exit 1

# Comando para iniciar aplicação
CMD ["node", "server.js"]
