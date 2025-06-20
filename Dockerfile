FROM node:20-alpine AS base

ARG WITH_SAMPLE_DATA=false

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
COPY .env.example .env

RUN if [ "$WITH_SAMPLE_DATA" = "false" ]; then \
      rm -f data/sample-exercises.csv; \
    fi

RUN pnpm run build

# Production image, copy only necessary files
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data

COPY scripts /app
RUN chmod +x /app/setup.sh

EXPOSE 3000
ENV PORT=3000
ENV WITH_SAMPLE_DATA=$WITH_SAMPLE_DATA

ENTRYPOINT ["/app/setup.sh"]

CMD ["pnpm", "start"]