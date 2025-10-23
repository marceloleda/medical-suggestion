# Estágio base
FROM node:20-alpine AS base

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# ================================
# Estágio de Desenvolvimento
# ================================
FROM base AS development

# Instalar TODAS as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3001

# Comando para desenvolvimento (com hot-reload via tsx watch)
# Gera o Prisma Client e inicia o servidor
CMD ["sh", "-c", "npx prisma generate && npm run dev"]

# ================================
# Estágio de Builder (para produção)
# ================================
FROM base AS builder

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação TypeScript
RUN npm run build

# ================================
# Estágio de Produção
# ================================
FROM node:20-alpine AS production

WORKDIR /app

# Copiar apenas package.json
COPY package*.json ./

# Instalar APENAS dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código compilado do estágio builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Gerar Prisma Client
RUN npx prisma generate

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Mudar propriedade dos arquivos
RUN chown -R nodejs:nodejs /app

# Usar usuário não-root
USER nodejs

# Expor porta
EXPOSE 3001

# Comando para produção
CMD ["npm", "start"]
