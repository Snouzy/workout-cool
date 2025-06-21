.PHONY: dev up down db-migrate db-generate db-seed help

help:
	@echo "🚀 Workout Cool Development Commands"
	@echo ""
	@echo "  dev         - Start full dev environment (DB, migrate, seed, Next.js dev server)"
	@echo "  up          - Start PostgreSQL database using Docker Compose"
	@echo "  down        - Stop all Docker Compose services"
	@echo "  db-migrate  - Run Prisma migrations"
	@echo "  db-generate - Generate Prisma client"
	@echo "  db-seed     - Seed database"
	@echo ""

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

# Start the dev server (with DB, migrate, seed)
dev: up db-migrate db-generate db-seed
	pnpm dev