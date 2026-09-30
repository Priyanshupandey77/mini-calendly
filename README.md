# MeetFlow

MeetFlow is a full-stack scheduling platform that lets users create events, manage their availability, and allow guests to book available time slots.

## 🚀 Live Demo

[**Try MeetFlow →**](https://meetflow-scheduler.vercel.app/)

## ✨ Features

- 🔐 JWT authentication with persistent login
- 📅 Create, edit, and delete events
- 🕒 Manage weekly availability
- 🔗 Shareable public booking links
- 📆 Automatic time-slot generation
- 🚫 Booking conflict and availability validation
- ❌ Host and guest booking cancellation
- 🔄 Cancelled slots become available again
- 📊 Booking management dashboard
- 📱 Responsive and mobile-friendly UI
- ⚡ Loading states and user-friendly error handling
- ✅ Zod request validation

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- React Router
- Tailwind CSS
- Axios
- Vite

**Backend**
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT
- bcrypt

**Deployment**
- Vercel
- Render
- PostgreSQL / Neon

## 🏗️ Architecture

```text
React + TypeScript
        │
      Axios
        ▼
Express + TypeScript
        │
      Prisma
        ▼
   PostgreSQL


```

## 📅 How It Works
Create Event
     ↓
Set Availability
     ↓
Generate Available Slots
     ↓
Guest Selects Date & Time
     ↓
Validate Availability & Conflicts
     ↓
Create Booking
     ↓
Slot Becomes Unavailable

Cancelled bookings automatically make their slots available again.

## 📚 What I Learned

Building MeetFlow helped me gain hands-on experience with:

Full-stack TypeScript development
REST API design
JWT authentication
Prisma & PostgreSQL
Database relationships and migrations
Transactions and validation
Booking conflict detection
Date and time handling
Protected routes
Responsive React development
Production deployment and debugging
##🔮 Future Improvements
Password reset / forgot password
Email notifications for bookings
## 📄 License

This project was built for learning and portfolio purposes.
