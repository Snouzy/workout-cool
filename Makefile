.PHONY: dev setup up down help

help:
	@echo "🚀 Workout Cool Development Commands"
	@echo ""
	@echo "  dev     - Start development server (automatically sets up everything)"
	@echo "  setup   - One-time setup: database, schema, and sample data"
	@echo "  db      - Start PostgreSQL database only"
	@echo "  down    - Stop all services"
	@echo ""


db:
	@echo "🐘 Starting PostgreSQL database..."
	docker compose up -d postgres


setup: db
	@echo "📦 Installing dependencies..."
	pnpm install --frozen-lockfile
	@echo "🔄 Applying database migrations..."
	npx prisma migrate deploy
	npx prisma generate
	@echo "🌱 Seeding database with sample data..."
	pnpm run import:exercises-full ./data/sample-exercises.csv
	pnpm run db:seed-leaderboard
	@echo "✅ Setup complete!"


dev: setup
	@echo "🚀 Starting Next.js development server..."
	pnpm dev

down:
	@echo "🛑 Stopping all services..."
	docker compose down
