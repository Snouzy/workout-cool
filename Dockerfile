FROM node:20-alpine AS base

WORKDIR /app
RUN npm install -g pnpm

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set build-time environment variables directly
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000

RUN pnpm run build

# Production image, copy only necessary files
FROM base AS runner
WORKDIR /app

# Set runtime environment defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV SKIP_ENV_VALIDATION=true

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data

# Copy environment example as runtime defaults
COPY .env.example .env.defaults

# Copy and setup the entrypoint script
COPY scripts/setup.sh /app/setup.sh
RUN chmod +x /app/setup.sh

EXPOSE 3000

ENTRYPOINT ["/app/setup.sh"]
CMD ["pnpm", "start"]