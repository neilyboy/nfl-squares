# 🎯 Quick Command Reference

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npx prisma generate
npx prisma migrate dev --name init

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:3000
```

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npx prisma studio
```

## Docker Commands

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes (deletes data!)
docker-compose down -v

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Execute commands in container
docker-compose exec nfl-squares sh
```

## Production Deployment

```bash
# On your Ubuntu server:

# 1. Clone/copy project
cd /path/to/nfl-squares

# 2. Build and run with Docker
docker-compose up -d --build

# 3. Check logs
docker-compose logs -f

# 4. Access at http://your-server-ip:3000
```

## Backup & Restore

### Manual Backup (Copy Database File)

```bash
# Development
cp prisma/dev.db backup-$(date +%Y%m%d).db

# Docker
docker cp nfl-squares:/app/data/nfl-squares.db backup-$(date +%Y%m%d).db
```

### Using Built-in Backup

1. Go to Admin Dashboard
2. Click "Backup Data"
3. JSON file will download
4. Keep it safe!

### Restore from Backup

1. Go to Admin Dashboard
2. Click "Restore Data"
3. Select your backup JSON file

## Troubleshooting Commands

```bash
# Fix "module not found" errors
rm -rf node_modules package-lock.json
npm install

# Fix database issues
rm -f prisma/dev.db
npx prisma migrate dev

# Check Docker container status
docker-compose ps

# View Docker logs
docker-compose logs -f nfl-squares

# Restart Docker containers
docker-compose restart

# Get shell access to container
docker-compose exec nfl-squares sh
```

## Port Configuration

```bash
# Change port for development
PORT=3001 npm run dev

# Change port for Docker (edit docker-compose.yml)
ports:
  - "3001:3000"  # External:Internal
```

## Useful Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
alias nfl-dev="cd /home/neil/Documents/nfl-squares && npm run dev"
alias nfl-logs="docker-compose logs -f"
alias nfl-restart="docker-compose restart"
alias nfl-backup="docker cp nfl-squares:/app/data/nfl-squares.db backup-$(date +%Y%m%d).db"
```

## Network Access

```bash
# Find your local IP
hostname -I
# Or
ip addr show | grep "inet "

# Test from another device
curl http://YOUR_IP:3000

# Check if port is open
netstat -tulpn | grep 3000
```

## Performance Monitoring

```bash
# Monitor Docker resource usage
docker stats nfl-squares

# Check database size
du -h prisma/dev.db

# Monitor logs in real-time
docker-compose logs -f --tail=100
```

## Security

```bash
# Change file permissions (if needed)
chmod 600 prisma/dev.db

# Check Docker security
docker scan nfl-squares

# Update dependencies
npm audit fix
```

---

**Pro Tips:**

- Always backup before major changes
- Test locally before deploying to production
- Keep your PIN and password in a secure location
- Monitor logs during game day for issues
- Use `docker-compose restart` for quick updates
