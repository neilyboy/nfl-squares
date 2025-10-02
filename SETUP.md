# 🚀 Quick Setup Guide

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Prisma (database)
- TailwindCSS
- shadcn/ui components
- react-simple-keyboard
- qrcode library
- And more...

### 2. Initialize the Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init
```

This creates a SQLite database file at `prisma/dev.db`.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 4. First-Time Setup

When you first open the app, you'll be prompted to:
1. Create an admin PIN (4 or 6 digits)
2. Create a recovery password (minimum 8 characters)

**Save these credentials safely!**

## Docker Deployment (Production)

### Option 1: Docker Compose (Recommended)

**IMPORTANT**: Before building with Docker, make sure you have a `package-lock.json` file:

```bash
# Generate lock file if it doesn't exist
npm install --package-lock-only

# Then build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Option 2: Manual Docker Build

```bash
# Build image
docker build -t nfl-squares .

# Run container
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --name nfl-squares \
  nfl-squares
```

### Data Persistence

The SQLite database is stored in the `data/` directory, which is mounted as a Docker volume. This ensures your data persists across container restarts.

## Network Access

### Local Network Access

If you want to access the app from other devices on your network:

1. Find your server's IP address:
   ```bash
   # Linux/Mac
   hostname -I
   
   # Or
   ifconfig | grep "inet "
   ```

2. Make sure port 3000 is not blocked by your firewall

3. Access from other devices:
   ```
   http://YOUR_SERVER_IP:3000
   ```

### Raspberry Pi Kiosk Setup

For a dedicated touchscreen kiosk:

1. Install Chromium browser:
   ```bash
   sudo apt-get update
   sudo apt-get install chromium-browser unclutter
   ```

2. Create autostart file:
   ```bash
   mkdir -p ~/.config/lxsession/LXDE-pi
   nano ~/.config/lxsession/LXDE-pi/autostart
   ```

3. Add these lines:
   ```
   @xset s off
   @xset -dpms
   @xset s noblank
   @chromium-browser --kiosk --disable-restore-session-state http://YOUR_SERVER_IP:3000
   @unclutter -idle 0
   ```

4. Reboot:
   ```bash
   sudo reboot
   ```

## Environment Configuration

### Development

The default `.env` configuration works out of the box for development.

### Production

For production deployments, consider:

1. Using a persistent volume for the database
2. Setting up regular backups
3. Using a reverse proxy (nginx/Caddy) with HTTPS
4. Setting appropriate firewall rules

## Troubleshooting

### "Module not found" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Database errors

```bash
# Reset database
rm -f prisma/dev.db
npx prisma migrate dev
```

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Docker: "Cannot connect to database"

```bash
# Check if volume is mounted correctly
docker-compose down -v
docker-compose up -d --build
```

## Testing

### Manual Testing Checklist

- [ ] First-time setup completes
- [ ] Admin can create a board
- [ ] Users can select and purchase squares
- [ ] On-screen keyboard appears for touch input
- [ ] QR codes display correctly
- [ ] Board finalizes and reveals numbers
- [ ] Multiple boards cycle on main screen
- [ ] Backup/restore works
- [ ] Admin can manage squares (mark paid/delete)

### Test Payment Methods

Use test usernames for payment methods during development:
- PayPal: `test-paypal`
- Venmo: `test-venmo`
- Cash: Enable and test

## Next Steps

1. **Test the application** thoroughly
2. **Add your team logos** (already provided in `team_logos/` and `team_wordmarks/`)
3. **Configure payment methods** (add your real PayPal/Venmo usernames)
4. **Set up backups** (use the admin backup feature regularly)
5. **Deploy to your server** (use Docker for easiest deployment)

## Support

For issues or questions:
1. Check the main README.md
2. Review the troubleshooting section above
3. Check Docker logs: `docker-compose logs -f`
4. Review browser console for frontend errors

---

**Have a great party! 🏈🎉**
