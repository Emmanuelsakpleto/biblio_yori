# Dockerfile pour YORI Frontend (Next.js)
FROM node:20-alpine3.19 AS base

# Installer les dépendances système nécessaires
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat curl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Étape de dépendances
FROM base AS deps
COPY package*.json ./
RUN npm ci --frozen-lockfile && npm cache clean --force

# Étape de construction
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construire l'application Next.js
RUN npm run build

# Étape de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer l'utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier seulement les fichiers nécessaires depuis l'étape de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Changer vers l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3000

# Variables d'environnement de runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Commande de démarrage
CMD ["node", "server.js"]
