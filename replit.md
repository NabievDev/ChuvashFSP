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
- December 2025: Initial full implementation
- Fixed DATABASE_URL conflict by using sqlite_database_url config variable
- Implemented Telegram sync with lifespan startup and hourly background refresh
- Added email notifications for contact form submissions via aiosmtplib
- Updated Telegram parser for current HTML structure

## Environment Variables (Optional)
For email notifications, configure:
- `SMTP_HOST` - SMTP server (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 587)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASSWORD` - SMTP password
