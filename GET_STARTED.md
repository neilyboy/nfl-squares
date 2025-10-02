# 🏈 Get Started in 5 Minutes!

## Quick Start (Copy & Paste)

```bash
# Navigate to project
cd /home/neil/Documents/nfl-squares

# Install dependencies (first time only)
npm install

# Initialize database (first time only)
npx prisma generate
npx prisma migrate dev --name init

# Start the app
npm run dev
```

**Note**: The `npm install` command will generate a `package-lock.json` file. Keep this file - it's needed for Docker builds!

Then open: **http://localhost:3000**

## First Time Setup

1. **Create Admin Credentials**
   - You'll see a setup screen
   - Enter a 4 or 6 digit PIN (e.g., `1234`)
   - Enter a recovery password (min 8 characters)
   - Click "Complete Setup"

2. **Login as Admin**
   - Click the "Admin" button (bottom right)
   - Enter your PIN
   - You're in!

3. **Create Your First Board**
   - Click "Create New Board"
   - Select a game from the ESPN schedule
   - Name it (e.g., "Main Board" or "$1 Per Square")
   - Set cost per square (e.g., `1.00`)
   - Set quarter payouts (default: 25% each = 100% total)
   - Add your PayPal/Venmo username (or enable cash)
   - Click "Create Board"

4. **Test User Flow**
   - Go back to home screen
   - Click "Buy Square"
   - Pick a square on the grid
   - Enter your name
   - Choose payment method
   - Done!

## What You Get

### Main Screen (User View)
- Auto-cycling boards (10 second rotation)
- Live game scores from ESPN
- Team logos and colors
- Current potential winner highlighted during game
- Quarter winner displays
- "Buy Square" and "Admin" buttons

### Admin Dashboard
- Create/edit/delete boards
- Manage square selections
- Mark payments as paid/unpaid
- Finalize boards (reveal numbers)
- Backup/restore all data
- View statistics

### Buy Square Flow
- Board selection (if multiple)
- Interactive grid
- On-screen keyboard (touch-friendly)
- QR code payment (PayPal/Venmo)
- Instant confirmation

## Deploy to Production (Docker)

```bash
# Build and start
docker-compose up -d --build

# Check it's running
docker-compose logs -f

# Access from network
http://YOUR_SERVER_IP:3000
```

Your data is saved in `./data/nfl-squares.db` (backed up with the Docker volume).

## Common Tasks

### Backup Your Data
**Option 1: Admin Interface**
1. Admin Dashboard → "Backup Data"
2. JSON file downloads
3. Save it somewhere safe

**Option 2: Manual**
```bash
# Development
cp prisma/dev.db backup-$(date +%Y%m%d).db

# Docker
docker cp nfl-squares:/app/data/nfl-squares.db backup.db
```

### Reset Everything
```bash
# Stop and remove everything (including database!)
docker-compose down -v

# Or just reset the database
rm -f prisma/dev.db
npx prisma migrate dev
```

### Change Port
```bash
# Development
PORT=3001 npm run dev

# Docker (edit docker-compose.yml)
ports:
  - "3001:3000"
```

## Raspberry Pi Touchscreen Kiosk

For a dedicated party display:

```bash
# 1. Point your Pi to your server
# Edit: ~/.config/lxsession/LXDE-pi/autostart

@chromium-browser --kiosk http://YOUR_SERVER_IP:3000

# 2. Reboot
sudo reboot
```

## Troubleshooting

**Can't install dependencies?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database errors?**
```bash
rm -f prisma/dev.db
npx prisma migrate dev
```

**Port already in use?**
```bash
PORT=3001 npm run dev
```

**Docker not working?**
```bash
docker-compose down -v
docker-compose up -d --build
```

## File Locations

- **Database**: `prisma/dev.db` (dev) or `data/nfl-squares.db` (Docker)
- **Team Logos**: `public/team_logos/` (already included!)
- **Team Wordmarks**: `public/team_wordmarks/` (already included!)
- **Vendor Logos**: `public/vendor_logos/` (PayPal, Venmo, Cash icons included!)

## Features Checklist

✅ Touch-screen optimized (on-screen keyboard for all inputs)  
✅ Dark modern theme  
✅ Multiple boards support  
✅ Auto board rotation  
✅ ESPN live scoring  
✅ Team logos and colors  
✅ PayPal QR codes  
✅ Venmo QR codes  
✅ Cash payments  
✅ Race condition handling (no double-booking)  
✅ Winner calculation per quarter  
✅ Admin PIN protection  
✅ Password recovery  
✅ Backup/restore  
✅ Docker deployment  
✅ Payment tracking  
✅ Board finalization (reveal numbers)  

## Support Files

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup instructions
- **COMMANDS.md** - All commands you might need
- **PROJECT_STATUS.md** - Technical architecture
- **GET_STARTED.md** - This file!

## Tips for Success

1. **Test before game day** - Set up and test everything at least a day early
2. **Backup regularly** - Use the admin backup feature
3. **Monitor on game day** - Keep the admin panel open to manage payments
4. **Network stability** - Make sure your WiFi is solid for the touchscreen kiosk
5. **Charge devices** - If using tablets/touchscreens, keep them plugged in

## Next Steps

1. ✅ Install and run (you're probably doing this now!)
2. ⬜ Test the full user flow
3. ⬜ Add your real PayPal/Venmo usernames
4. ⬜ Deploy to your server (optional, for network access)
5. ⬜ Set up your Pi touchscreen (optional, for kiosk mode)
6. ⬜ Invite your friends and have an awesome party! 🎉

---

**Questions?** Check the other documentation files or review the code!

**Have a great Super Bowl party! 🏈**
