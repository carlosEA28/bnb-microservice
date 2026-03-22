FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npx tsc

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api
RUN mkdir dist && chown api:nodejs dist && chown api:nodejs .
COPY --chown=api:nodejs package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder --chown=api:nodejs /app/dist ./dist
USER api
EXPOSE 3004
ENV PORT=3004
ENV HOSTNAME="0.0.0.0"
CMD ["node", "dist/server.js"]