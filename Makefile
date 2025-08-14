.PHONY: dev up down db-migrate db-generate db-seed help

help:
	@echo "🚀 Workout Cool Development Commands"
	@echo ""
	@echo "  dev                 - Start full dev environment (DB, migrate, seed, Next.js dev server)"
	@echo "  up                  - Start PostgreSQL database using Docker Compose"
	@echo "  down                - Stop all Docker Compose services"
	@echo "  db-migrate          - Run Prisma migrations"
	@echo "  db-generate         - Generate Prisma client"
	@echo "  db-seed             - Seed database with exercises"
	@echo "  db-seed-leaderboard - Seed database with leaderboard sample data"
	@echo "  db-seed-all         - Seed everything (exercises + leaderboard)"
	@echo ""


# Install Dependencies
deps:
	pnpm install --frozen-lockfile

# Start Postgres with Docker Compose
up:
	docker compose up -d postgres

# Stop Docker Compose
down:
	docker compose down

# Run Prisma migrations
db-migrate:
	npx prisma migrate deploy

# Generate Prisma client
db-generate:
	npx prisma generate

# Seed database
db-seed:
	pnpm run import:exercises-full ./data/sample-exercises.csv

# Seed database with leaderboard data
db-seed-leaderboard:
	pnpm run db:seed-leaderboard

# Seed everything (exercises + leaderboard)
db-seed-all: db-seed db-seed-leaderboard

# Start the dev server (with DB, migrate, seed)
dev: up deps db-migrate db-generate db-seed-all
	pnpm dev
