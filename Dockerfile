# Multi-stage Dockerfile para Dashboard de Investimentos
# Baseado em melhores práticas de segurança e performance

# Stage 1: Build Stage
FROM node:18-alpine AS build

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Criar utilizador não-root para segurança
RUN addgroup -g 1001 -S nodejs &&     adduser -S nodejs -u 1001 -G nodejs

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat curl

# Copiar ficheiros de dependências primeiro (para cache layer)
COPY package*.json ./

# Instalar dependências (apenas produção para imagem minimal)
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte da aplicação
COPY . .

# Definir permissões corretas
RUN chown -R nodejs:nodejs /app
USER nodejs

# Stage 2: Production Stage com Nginx
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Criar utilizador não-root para nginx
RUN addgroup -g 1001 -S nginx-user &&     adduser -S nginx-user -u 1001 -G nginx-user

# Remover configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar ficheiros da aplicação do stage de build
COPY --from=build --chown=nginx-user:nginx-user /app /usr/share/nginx/html

# Criar diretórios necessários e definir permissões
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run &&     chown -R nginx-user:nginx-user /var/cache/nginx /var/log/nginx /var/run /etc/nginx/conf.d

# Expor porta 8080 (não-privilegiada)
EXPOSE 8080

# Definir utilizador não-root
USER nginx-user

# Health check para monitorização
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3   CMD curl -f http://localhost:8080/ || exit 1

# Comando para iniciar nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
