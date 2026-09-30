# MeetFlow

MeetFlow is a full-stack scheduling platform that allows users to create events, define their availability, and let guests book available time slots.

## 🚀 Live Demo

**(https://meetflow-scheduler.vercel.app/)**

## ✨ Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Persistent login
- Logout functionality
- Protected dashboard routes
- Duplicate email detection

### Event Management
- Create events
- Edit events
- Delete events
- Custom event slugs
- Event duration configuration
- Public booking links

### Availability Management
- Define weekly availability
- Multiple availability slots per day
- Update availability
- Delete availability
- Prevent overlapping availability slots

### Booking System
- Public booking page
- Automatic time-slot generation
- Prevent booking outside host availability
- Prevent overlapping bookings
- Prevent booking times in the past
- Cancel bookings
- Cancelled slots become available again
- Confirmed and cancelled booking status

### Dashboard
- Event overview
- Booking management
- Booking status filtering
- Responsive dashboard
- Mobile-friendly navigation

### UX & Error Handling
- Loading states during authentication
- Disabled buttons during requests
- User-friendly error messages
- Form validation with Zod
- Centralized backend error handling
- Responsive UI

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- React Router
- Tailwind CSS
- Axios
- Vite

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- bcrypt

### Deployment
- Vercel — Frontend
- Render — Backend
- PostgreSQL / Neon — Database

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │     MeetFlow     │
                    │    React + TS    │
                    └────────┬─────────┘
                             │
                          Axios
                             │
                             ▼
                    ┌──────────────────┐
                    │   Express API    │
                    │   Node + TS      │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │      Prisma      │
                    │       ORM        │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    │     Database     │
                    └──────────────────┘




📅 Booking Flow
Host creates event
        ↓
Host defines availability
        ↓
MeetFlow generates available slots
        ↓
Guest opens public booking page
        ↓
Guest selects date & time
        ↓
Backend validates availability
        ↓
Backend checks booking conflicts
        ↓
Booking is created
        ↓
Slot becomes unavailable

If a booking is cancelled:

Booking cancelled
        ↓
Status → CANCELLED
        ↓
Slot becomes available again
📂 Project Structure
meetflow/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── middleware/
│   │   ├── errors/
│   │   └── lib/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── layouts/
    │   ├── services/
    │   ├── contexts/
    │   └── types/
    │
    └── package.json
⚙️ Getting Started
Clone the repository
git clone <your-github-repository-url>
cd meetflow
Backend Setup
cd backend
npm install

Create a .env file:

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Generate Prisma Client:

npx prisma generate

Run migrations:

npx prisma migrate dev

Start the backend:

npm run dev
Frontend Setup

Open another terminal:

cd frontend
npm install

Create a .env file:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev
🔌 API Overview
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Events
POST   /api/event
GET    /api/event
GET    /api/event/:slug
PUT    /api/event/:id
DELETE /api/event/:id
Availability
POST   /api/availability
GET    /api/availability
PUT    /api/availability/:id
DELETE /api/availability/:id
Bookings
POST   /api/booking
POST   /api/booking/:id/cancel
DELETE /api/booking/:id
GET    /api/host
📚 What I Learned

Building MeetFlow helped me work with:

Full-stack TypeScript development
REST API architecture
JWT authentication
Password hashing
Prisma and PostgreSQL
Database relationships
Database migrations
Transactions
Request validation with Zod
Centralized error handling
Booking conflict detection
Time-slot generation
Date and time handling
Protected routes
Persistent authentication
Responsive React UI
Production environment variables
Vercel deployment
Render deployment
Production debugging
🔮 Future Improvements

Potential future features:

Forgot/reset password
Email notifications for bookings
📄 License

This project was created for learning and portfolio purposes.   
