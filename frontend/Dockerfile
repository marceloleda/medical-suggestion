# Estágio base
FROM node:20-alpine AS base

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# ================================
# Estágio de Desenvolvimento
# ================================
FROM base AS development

# Instalar TODAS as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento (com hot-reload)
CMD ["npm", "run", "dev"]

# ================================
# Estágio de Builder (para produção)
# ================================
FROM base AS builder

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Variáveis de ambiente para build (pode ser sobrescrito)
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Desabilitar telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build da aplicação Next.js
RUN npm run build

# ================================
# Estágio de Produção
# ================================
FROM node:20-alpine AS production

WORKDIR /app

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar apenas package.json
COPY package*.json ./

# Instalar APENAS dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos necessários do builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Ajustar permissões para Next.js
RUN chown -R nextjs:nodejs /app/.next

# Usar usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Comando para produção
CMD ["npm", "start"]
