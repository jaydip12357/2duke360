# DukeReuse360

Duke University's smart reusable container tracking system for sustainable dining.

## Features

- **Student Dashboard**: Personal QR code, container tracking, impact statistics, gamification
- **Dining Staff Interface**: QR/RFID scanning, inventory management, batch processing
- **Facilities Management**: Container lifecycle, QR code generation, maintenance tracking
- **Admin Analytics**: Real-time insights, environmental impact, financial metrics
- **Demo Mode**: Auto-demo for hackathon presentations with live activity simulation

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js
- **QR Codes**: qrcode (generation), html5-qrcode (scanning)
- **Charts**: Recharts
- **Deployment**: Railway

## Duke Color Theme

- Primary: Duke Blue `#012169`
- Secondary: Duke Navy `#003366`
- Accent: Royal Blue `#00539B`
- Success: `#339966`
- Warning: `#F09905`

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jaydip12357/2duke360.git
cd 2duke360
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and NextAuth secret
```

4. Push database schema:
```bash
npm run db:push
```

5. Seed the database with demo data:
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
/app
  /api
    /auth        # NextAuth endpoints
    /containers  # Container CRUD
    /users       # User management
    /scan        # QR/RFID scanning
    /admin       # Admin endpoints
    /health      # Health check
  /student       # Student dashboard & scan
  /dining-staff  # Staff interface
  /facilities    # Container management
  /admin         # Analytics dashboard
  /demo          # Demo QR codes
  /presentation  # Auto-demo mode
  /judges        # Quick tour for judges
/components
  /ui            # Base UI components
  /student       # Student-specific components
  /staff         # Staff components
  /shared        # Shared components (QR, RFID, Stats)
/lib
  /db            # Prisma client
  /qr            # QR code utilities
  /rfid          # RFID simulation
  /utils         # Helper functions
/prisma
  schema.prisma  # Database schema
  seed.ts        # Demo data seeder
```

## Key Pages

| Path | Description |
|------|-------------|
| `/` | Home page with quick access |
| `/student/dashboard` | Student QR code, containers, stats |
| `/student/scan` | QR scanner for checkout/return |
| `/dining-staff/dashboard` | Staff scanning & inventory |
| `/dining-staff/scan` | Dual-mode scanner (QR/RFID) |
| `/facilities/dashboard` | Container lifecycle management |
| `/admin` | Analytics & user management |
| `/demo/qr-codes` | Printable demo QR codes |
| `/presentation` | Auto-demo with live stats |
| `/judges` | Quick feature tour |

## Demo Mode

Access demo features:
- Triple-click the Duke logo on home page
- Press `Ctrl+Shift+D` in admin panel
- Visit `/demo/qr-codes` for printable QR codes
- Visit `/presentation` for 2-minute auto demo

## Database Schema

- **User**: Students, staff, facilities, admin
- **Container**: QR code, RFID tag, status, location
- **Transaction**: Checkout/return history
- **Location**: Dining halls and return stations
- **ImpactStats**: Environmental metrics per user

## Deployment

### Railway

1. Create a new project on Railway
2. Add PostgreSQL database
3. Connect your GitHub repository
4. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Deploy!

The app includes a health check endpoint at `/api/health`.

## Demo Credentials

After running the seed script:
- **Admin**: admin@duke.edu / demo123
- **Staff**: sarah.johnson@duke.edu / demo123
- **Student**: alex.kim@duke.edu / demo123

## License

MIT
