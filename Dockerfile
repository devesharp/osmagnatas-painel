# Use a imagem oficial do Node.js
FROM node:20-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
# Verificar se libc6-compat pode ser necessário
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências baseado no gerenciador de pacotes preferido
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Rebuild o código-fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Argumentos de build para o Sentry
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG NEXT_PUBLIC_SENTRY_DSN

# Variáveis de ambiente para o build
ENV NEXT_TELEMETRY_DISABLED=1
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}

# Instalar Sentry CLI
RUN npm install -g @sentry/cli

# Gerar uma versão única para o release
ARG BUILD_TIME
ENV SENTRY_RELEASE=${BUILD_TIME}

# Criar release no Sentry antes do build
RUN if [ -n "$SENTRY_AUTH_TOKEN" ]; then \
    echo "Criando release no Sentry: $SENTRY_RELEASE" && \
    sentry-cli releases new "$SENTRY_RELEASE" && \
    sentry-cli releases set-commits "$SENTRY_RELEASE" --auto; \
  else \
    echo "SENTRY_AUTH_TOKEN não fornecido, pulando criação de release"; \
  fi

# Build da aplicação
RUN yarn build

# Upload de source maps para o Sentry após o build
RUN if [ -n "$SENTRY_AUTH_TOKEN" ]; then \
    echo "Fazendo upload de source maps para o Sentry" && \
    sentry-cli releases files "$SENTRY_RELEASE" upload-sourcemaps .next/static --url-prefix '~/_next/static' && \
    sentry-cli releases finalize "$SENTRY_RELEASE"; \
  else \
    echo "SENTRY_AUTH_TOKEN não fornecido, pulando upload de source maps"; \
  fi

# Imagem de produção, copiar todos os arquivos e rodar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Aproveitar automaticamente traces de saída para reduzir o tamanho da imagem
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]