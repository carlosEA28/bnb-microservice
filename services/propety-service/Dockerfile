FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production --fetch-retries=5 --fetch-retry-mintimeout=20000
COPY prisma ./prisma
RUN npx prisma generate --schema=prisma/schema.prisma

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api
RUN chown api:nodejs .
COPY --chown=api:nodejs package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=api:nodejs prisma ./prisma
COPY --chown=api:nodejs src ./src
USER api
EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"
CMD ["npx", "tsx", "src/server.ts"]