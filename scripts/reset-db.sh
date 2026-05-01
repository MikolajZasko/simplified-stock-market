#!/bin/sh

# Stop on any error
set -e

echo "--- 1. Resetting Database Schema ---"
psql $DATABASE_URL -f /app/scripts/reset-db.sql

echo "--- 2. Pushing Drizzle Schema ---"
npx drizzle-kit push --config=./src/db/drizzle_configs/drizzle.config.ts --force

echo "--- Database is ready! ---"