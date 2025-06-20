#!/bin/sh

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

if [ "$WITH_SAMPLE_DATA" = "true" ]; then
  echo "Sample data build found, importing sample data..."
  npx tsx import-exercises-with-attributes.ts ./data/sample-exercises.csv
else
  echo "No sample data build found, skipping import."
fi

echo "Starting the app..."
exec "$@"  # runs the CMD from the Dockerfile
