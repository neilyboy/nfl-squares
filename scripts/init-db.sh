#!/bin/bash
# Database initialization script

echo "🏈 NFL Squares - Database Initialization"
echo "========================================"

# Create data directory if it doesn't exist
mkdir -p data

# Set DATABASE_URL for development
export DATABASE_URL="file:./prisma/dev.db"

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "✅ Database initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Complete the first-time setup"
