# FSP Chuvashia - Федерация спортивного программирования Чувашской Республики

## Overview
Official website for the Federation of Sports Programming of the Chuvash Republic (РФСОО «ФСП по Чувашской Республике»). Modern full-stack application with React frontend and FastAPI backend.

## Project Structure
```
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic (Telegram parser)
│   │   ├── utils/          # Auth utilities
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database connection
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── seed_data.py    # Initial data
│   ├── uploads/            # Document uploads
│   └── main.py             # Application entry point
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React contexts (Theme)
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin panel pages
│   │   └── services/       # API services
│   └── vite.config.js      # Vite configuration
└── replit.md               # This file
```

## Technologies
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Uvicorn
- **Database**: SQLite3
- **Features**: Dark/Light theme, Responsive design, Admin panel

## Running the Application
- **Backend**: `cd backend && python main.py` (port 8000)
- **Frontend**: `cd frontend && npm run dev` (port 5000)

## Key Features
1. **Home Page**: Organization overview, disciplines, history timeline
2. **Leadership**: Organizational hierarchy and leadership
3. **Team**: Athletes representing Chuvash Republic
4. **Documents**: Official documents organized by category
5. **Events**: Calendar with events and competitions
6. **News**: Integration with Telegram channel @fspchuv
7. **Contacts**: Contact form and information
8. **Admin Panel**: Full CRUD for all content

## Color Scheme
Orange-red-yellow gradient based on FSP Chuvashia logo colors:
- Primary Orange: #F97316
- Secondary Red: #EF4444
- Accent Yellow: #FACC15

## API Endpoints
- `POST /api/auth/login` - Admin authentication
- `GET/POST/PUT/DELETE /api/news` - News management
- `GET/POST/PUT/DELETE /api/events` - Events management
- `GET/POST/PUT/DELETE /api/documents` - Documents management
- `GET/POST/PUT/DELETE /api/team` - Team members
- `GET/POST/PUT/DELETE /api/leadership` - Leadership
- `POST /api/contact` - Contact form submission

## Admin Credentials
Default admin can be created through the registration link on the login page.

## Recent Changes

### December 2025 - Complete UI/UX Redesign
- **Loading Screen Animation**: Custom logo animation with ФСП letters, glow effects, and particle system (shows on first home page visit per session)
- **Custom Cursor**: Adaptive cursor with click animations and color adaptation, site-wide implementation
- **Dark Theme Default**: Dark theme is now the default across all pages
- **Designer Section Titles**: New SectionTitle component with "//" decorators, gradient underlines, and uppercase subtitles
- **Home Page Redesign**: Provocative slogan "Код. Скорость. Победа.", single "О нас" button, animated background with circuit pattern
- **Leadership Page**: Graph-style hierarchy layout with curved SVG branches connecting organizational levels
- **Team Page**: Clickable sections with trophy icons, "Юниоры" badges for junior teams, graph-style vertical/horizontal connections
- **Documents Page**: Graph-style layout with folder animations, vertical/horizontal branch connections
- **Events Page**: Improved calendar with December 2025 test data, removed "Сегодня" label, better date highlighting
- **Responsive Design**: All pages optimized for mobile, tablet, and desktop

### Core Components Added
- `LoadingScreen.jsx` - Animated intro screen with logo and ФСП letters
- `CustomCursor.jsx` - Site-wide custom cursor with adaptive colors
- `SectionTitle.jsx` - Reusable section header with designer styling

### Initial Implementation
- Full-stack React + FastAPI architecture
- Telegram channel integration (@fspchuv) for news sync
- Admin panel with CRUD operations
- Contact form with email notifications
- SQLite database with test data seeding

## Environment Variables (Optional)
For email notifications, configure:
- `SMTP_HOST` - SMTP server (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 587)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASSWORD` - SMTP password

## Design System
- **Primary Color**: Orange #F97316
- **Accent Colors**: Red #EF4444, Yellow #FACC15
- **Dark Background**: #0a0a0f (dark-950)
- **Typography**: Bold headings, gradient text effects
- **Animations**: Framer Motion for smooth transitions
- **Graph-style Elements**: SVG paths with curved connections for hierarchical pages
