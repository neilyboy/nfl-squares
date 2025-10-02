# 🏈 NFL Squares - Super Bowl Party App

A modern, touch-screen friendly web application for managing NFL squares boards for Super Bowl parties and other games. Features real-time scoring via ESPN API, professional TV-style scorebug displays, payment tracking (PayPal/Venmo/Cash), and automatic winner calculation.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### For Users
- **Professional TV-Style Display**: Broadcast-quality scorebug with team logos, wordmarks, and gradient backgrounds
- **Touch-Screen Optimized**: Full on-screen keyboard support for kiosks and touch devices
- **Multiple Square Selection**: Click multiple squares to buy them all at once with one payment
- **Multiple Boards**: Support for multiple simultaneous boards (main board, kids board, etc.)
- **Smart Auto-Cycling**: Boards automatically rotate on display (pauses when viewing square details)
- **Player Initials Display**: Quick view of who owns each square with clickable details
- **Payment Options**: Integrated PayPal and Venmo QR codes, plus cash option
- **Live Scoring**: Real-time game updates from ESPN API every 30 seconds
- **Winner Tracking**: Automatic winner calculation and display for each quarter
- **Team Branding**: Authentic NFL team colors, logos, and wordmarks throughout

### For Admins
- **Secure Admin Area**: PIN-protected with password recovery
- **Board Management**: Create, view details, delete, and archive boards
- **Game Selection**: Choose from upcoming NFL games via ESPN API
- **Flexible Payouts**: Customize payout percentages for each quarter (Q1-Q4)
- **Payment Method Control**: Enable/disable PayPal, Venmo, or Cash per board
- **Payment Tracking**: Monitor which squares are paid/unpaid with visual indicators
- **Bulk Payment Marking**: Mark all unpaid squares as paid with one click
- **Per-Player Bulk Actions**: Mark all squares for a specific player as paid at once
- **Board Finalization**: Reveal randomized numbers when ready
- **Backup/Restore**: Export and import all data as JSON
- **On-Screen Keyboard Toggle**: Optional keyboard for touch-screen admins

## 🎨 Visual Features

### Professional TV-Style Scorebug
- **Rounded corners** with gap in the middle (just like ESPN/NFL Network)
- **Team logos** that overhang the scorebug for dramatic effect
- **Gradient backgrounds** using each team's primary and secondary colors
- **Team wordmarks** with white outline for visibility on any background
- **Large scores** with black stroke and shadow effects

### Team Branding
- Authentic **NFL team logos** (SVG format for crisp display)
- Official **team wordmarks** for professional look
- **Team-specific colors** for grid rows and columns
- **Gradient effects** using team secondary colors

### Grid Display
- **Player initials** shown in claimed squares (2-3 letters)
- **Payment status icons** (Venmo, PayPal, Cash)
- **Click any square** to see full player details in a modal
- **Color-coded** by team (rows = away team, columns = home team)
- **Auto-pause** board cycling when viewing square details

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/neilyboy/nfl-squares.git
   cd nfl-squares
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   ```

3. **Initialize database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   ```
   http://localhost:3000
   ```

### Docker Deployment

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

2. **Access the app**:
   ```
   http://your-server-ip:3000
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop the app**:
   ```bash
   docker-compose down
   ```

### Raspberry Pi Setup (Kiosk Mode)

1. **Install Chromium**:
   ```bash
   sudo apt-get update
   sudo apt-get install chromium-browser unclutter
   ```

2. **Set up autostart** (`~/.config/lxsession/LXDE-pi/autostart`):
   ```
   @chromium-browser --kiosk --disable-restore-session-state http://your-server-ip:3000
   @unclutter -idle 0
   ```

3. **Disable screen blanking** (in `/etc/lightdm/lightdm.conf`):
   ```
   xserver-command=X -s 0 -dpms
   ```

## 📖 Usage Guide

### First-Time Setup

1. On first launch, you'll be prompted to create an admin PIN (4 or 6 digits) and a recovery password (minimum 8 characters)
2. Complete the setup to access the application

### Creating a Board

1. Click **Admin** button and enter your PIN
2. Click **Create New Board**
3. Select a game from the ESPN schedule
4. Enter board details:
   - **Board Name**: e.g., "$1 Per Square" or "Kids Board"
   - **Cost Per Square**: e.g., $1.00, $0.25, $10.00
   - **Quarter Payouts**: Percentages for Q1, Q2, Q3, Q4 (must total 100%)
   - **Accepted Payment Methods**: 
     - ✅ Enable/disable PayPal (enter username if enabled)
     - ✅ Enable/disable Venmo (enter username if enabled)
     - ✅ Enable/disable Cash payments
5. Click **Create Board**

### Users Buying Squares

1. On the main screen, click **Buy Square**
2. Select which board (if multiple)
3. **Click one or more available squares** to select them
   - Click a square to select it (highlighted)
   - Click again to deselect
   - Total cost updates automatically
4. Enter your name (on-screen keyboard available)
5. Click **Continue to Payment**
6. Choose payment method and scan QR code or mark as paid
   - Payment amount includes all selected squares
7. All your squares are now reserved with one purchase!

### Finalizing a Board

1. Go to **Admin → Manage Boards**
2. Find your board and click **Finalize**
3. This will:
   - Generate random 0-9 numbers for rows and columns
   - Reveal the numbers to all users
   - Close the board to new purchases

### During the Game

- Boards will automatically update with live scores from ESPN
- The app highlights the current potential winning square
- Winners are calculated automatically at the end of each quarter

### Managing Payments

1. Go to **Admin → Manage Boards**
2. Click **View Details** on a board
3. You'll see all filled squares with payment status
4. **Individual marking**: Click "Mark Paid" or "Mark Unpaid" for each square
5. **Bulk marking options**:
   - Click **"Mark All Paid"** button (top right) to mark ALL unpaid squares at once
   - Click **"Mark All"** next to a player's name to mark all their unpaid squares
6. Delete squares if payment fails or needs to be refunded

### Backup and Restore

**Backup**:
1. Go to **Admin Dashboard**
2. Click **Backup Data**
3. A JSON file will download with all data

**Restore**:
1. Go to **Admin Dashboard**
2. Click **Restore Data**
3. Select your backup JSON file

## 🗂️ Project Structure

```
nfl-squares/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── team_logos/            # NFL team logos (SVG)
│   ├── team_wordmarks/        # NFL team wordmarks (SVG)
│   ├── team_colors/           # Team colors CSV
│   └── vendor_logos/          # PayPal/Venmo logos
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── admin/            # Admin pages
│   │   ├── buy/              # Buy square page
│   │   ├── setup/            # First-time setup
│   │   ├── page.tsx          # Main board display
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── squares-grid.tsx  # 10x10 grid component
│   │   ├── game-header.tsx   # Game info display
│   │   ├── winners-display.tsx
│   │   ├── qr-code-display.tsx
│   │   ├── pin-entry-dialog.tsx
│   │   └── on-screen-keyboard.tsx
│   └── lib/
│       ├── db.ts             # Prisma client
│       ├── auth.ts           # Authentication utilities
│       ├── espn-api.ts       # ESPN API integration
│       └── utils.ts          # Helper functions
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose setup
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="production"
```

### ESPN API

The app uses ESPN's unofficial public API endpoints. No API key is required. The app polls for updates every 30 seconds during live games to minimize load.

### Payment Integration

- **PayPal**: Uses `paypal.me` links for instant payment
- **Venmo**: Uses Venmo profile links
- **Cash**: Simple tracking with admin confirmation

## 📱 Touch Screen Optimization

- All buttons are minimum 44x44px for easy tapping
- On-screen keyboard automatically appears for all text inputs
- Large, easy-to-read fonts and high contrast
- Swipe-friendly board navigation
- No hover-dependent features

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm -f prisma/dev.db
npx prisma migrate dev
```

### Port Already in Use
```bash
# Change port in package.json or use:
PORT=3001 npm run dev
```

### Docker Issues
```bash
# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Can't Access on Network
- Make sure firewall allows port 3000
- For Docker, ensure port mapping is correct in `docker-compose.yml`

## 🔐 Security Notes

- Admin PIN is hashed using bcrypt
- Recovery password is also hashed
- No sensitive data is stored in plain text
- SQLite database file should be backed up regularly
- For production use, consider adding HTTPS

## 🛠️ Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM with SQLite
- **TailwindCSS** - Utility-first CSS framework

### UI & Components
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Icon library
- **react-simple-keyboard** - On-screen keyboard
- **qrcode** - QR code generation

### API & Data
- **ESPN API** - Live game data and scores
- **bcrypt** - Secure password hashing

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📸 Screenshots

> *Screenshots coming soon! Check out the live demo or run locally to see the app in action.*

Key views include:
- Main board display with TV-style scorebug
- Admin dashboard and board management
- Touch-friendly square selection
- Payment method selection with QR codes
- Real-time winner tracking

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest new features
- 🔧 Submit pull requests
- ⭐ Star the repo if you find it useful!

## 📄 License

MIT License - feel free to use and modify for your parties and events!

## 🙏 Credits

Built by [@neilyboy](https://github.com/neilyboy) with:
- Next.js 14, React, TypeScript, and TailwindCSS
- UI components from shadcn/ui
- On-screen keyboard by react-simple-keyboard
- QR codes by qrcode library
- Live game data from ESPN API
- NFL team assets (logos, wordmarks, colors)

## 📞 Support

Having issues? Check out:
- [Troubleshooting](#-troubleshooting) section above
- [GitHub Issues](https://github.com/neilyboy/nfl-squares/issues)

---

**Enjoy your Super Bowl party! 🏈🎉**

Made with ❤️ for football fans everywhere
