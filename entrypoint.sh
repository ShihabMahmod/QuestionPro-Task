#!/bin/sh

set -e

echo "Waiting for PostgreSQL to be ready..."

until npx prisma db push > /dev/null 2>&1; do
  echo "Database not ready yet... retrying in 3s"
  sleep 3
done

echo "Database is ready!"

echo "Running migrations..."

npx prisma migrate deploy

echo "Running seed (optional)..."
echo "Starting application..."

node src/app.js