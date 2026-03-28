# TRI-ANGLE Catering Website

A full-stack MERN application for **TRI-ANGLE Catering** — Kasaragod, Kerala.

## Tech Stack
- **Backend**: Node.js + Express + MongoDB + JWT
- **Frontend**: React + Vite + React Router

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on `localhost:27017`

### 2. Backend
```bash
cd backend
npm install
npm run seed    # Seeds DB with admin + event types + sample staff
npm run dev     # Starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

## Admin Login
- **URL**: http://localhost:5173/admin/login
- **Email**: admin@triangle.com
- **Password**: admin123

## Add Your Team Photos
1. Place your images in: `backend/images/`
2. Name them: `image1.jpg`, `image2.jpg`, ... `image10.jpg`
3. They will automatically display on the Staff page and in seeded staff profiles

## Features

### Customer Module
- Landing page with hero, services, team preview, testimonials, contact
- Register & Login
- Browse staff (filter by gender, search)
- Book catering staff with event type, date, venue, staff count selector
- Live cost estimator during booking
- My Bookings with status tracking
- Booking detail with staff assignment & timeline

### Admin Module (`/admin/login`)
- Dashboard with stats, revenue, monthly chart
- Staff Management (add/edit/delete, photo upload, availability toggle)
- Booking Management (approve, update status, assign, add notes)
- Customer Management (view, suspend/activate)
- Event Types (create/edit pricing for Marriage, Sadya, Engagement, etc.)

## Project Structure
```
Triangle/
├── backend/
│   ├── config/db.js
│   ├── models/         User, Staff, Booking, EventType
│   ├── controllers/    auth, staff, booking, event, admin
│   ├── routes/         auth, staff, bookings, events, admin
│   ├── middleware/     auth.js, upload.js
│   ├── images/         image1.jpg ... image10.jpg (place your photos here)
│   ├── uploads/staff/  (auto-created photo uploads)
│   ├── seeder.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/, context/, components/
        ├── pages/customer/   LandingPage, Login, Register, Staff, Booking, MyBookings
        └── pages/admin/      Dashboard, Staff, Bookings, Customers, Events
```
