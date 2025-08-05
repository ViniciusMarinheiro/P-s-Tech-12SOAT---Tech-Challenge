# Dockerfile para P&S Tech - Oficina API (NestJS + TypeORM + PostgreSQL)

# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine3.19 AS build

WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação com SWC
RUN yarn run build

# Limpar dependências de desenvolvimento
RUN yarn install --production --frozen-lockfile && yarn cache clean

# ================================
# Stage 2: Production
# ================================
FROM node:20-alpine3.19 AS production

# Instalar dependências do sistema necessárias
RUN apk update && apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /usr/src/app

# Copiar arquivos do stage de build
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Copiar arquivos de configuração necessários
COPY --from=build /usr/src/app/tsconfig.json ./tsconfig.json

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3333

# Expor a porta
EXPOSE 3333

# Mudar para usuário não-root
USER nestjs

# Verificação de saúde
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3333/api/v1/oficina/status', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]