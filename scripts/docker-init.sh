#!/bin/sh
# Docker container initialization script

echo "🏈 NFL Squares - Docker Initialization"
echo "======================================="

# Wait for filesystem to be ready
sleep 2

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "✅ Initialization complete!"
echo "🚀 Starting application..."

# Start the application
exec node server.js
