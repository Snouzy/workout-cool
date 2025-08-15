#!/bin/sh
set -e

echo "🚀 Starting Workout.cool setup..."

# Create .env from defaults if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 No .env found, creating from defaults..."
    cp .env.defaults .env
else
    echo "📝 Using existing .env file..."
fi

# Auto-detect if we're in docker-compose environment
if [ "$DB_HOST" = "postgres" ] || [ -n "$POSTGRES_PASSWORD" ]; then
    echo "🐳 Docker Compose environment detected"
    # Update DATABASE_URL if not already set correctly for docker-compose
    if [ -n "$POSTGRES_USER" ] && [ -n "$POSTGRES_PASSWORD" ] && [ -n "$POSTGRES_DB" ]; then
        export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST:-postgres}:${DB_PORT:-5432}/${POSTGRES_DB}"
        echo "🔗 Database URL configured for Docker Compose"
    fi
fi

if [ "$SKIP_DB_OPERATIONS" = "true" ]; then
    echo "⏭️  Skipping database operations (test mode)"
else
    echo "🗄️  Running Prisma migrations..."
    npx prisma migrate deploy

    echo "⚙️  Generating Prisma client..."
    npx prisma generate
fi

# Seed data if requested (only if DB operations are enabled)
if [ "$SEED_SAMPLE_DATA" = "true" ] && [ "$SKIP_DB_OPERATIONS" != "true" ]; then
    echo "🌱 Seeding sample data..."
    if [ -f "./data/sample-exercises.csv" ]; then
        npx tsx scripts/import-exercises-with-attributes.ts ./data/sample-exercises.csv
    else
        echo "⚠️  No sample exercises found, skipping..."
    fi
else
    echo "⏭️  Skipping sample data import"
fi

echo "✅ Setup complete! Starting the application..."
exec "$@"
