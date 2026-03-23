# Draper City Dumpster Rental

A web application for Draper City residents to reserve dumpsters for residential clean-up projects. Built as a capstone project for WDD499.

🔗 **Live Demo:** [dumpter-rental.onrender.com]([https://dumpster-rental.onrender.com])

---

## Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Rental Form
![Rental Form](screenshots/rental-form.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### My Rentals
![My Rentals](screenshots/my-rentals.png)

---

## Features

### For Residents
- 📅 Reserve a 20 or 30 yard dumpster online
- 🗓️ Flatpickr date picker restricted to Mondays and Thursdays only
- ⚡ Real-time availability check before submission
- 📋 View all personal rentals grouped by status (active, pending, past)
- 📄 Full rental details on the My Rentals page — no separate detail page needed

### For Admins
- 🔐 Role-based access control (admin / renter)
- 📊 View all rentals or current active rentals
- ✏️ Edit any rental — update status, receipt number, dates, and customer info
<!-- - 👥 View and manage all users, including role assignment -->

### General
- 🔒 Secure session-based authentication with hashed passwords
- 💬 Flash messages for errors and confirmations
- 📱 Fully responsive Bootstrap 5 UI

---

## Test Accounts

| Username | Role | Notes |
|---|---|---|
| `admintest` | Admin | Full access to admin dashboard, all rentals, user management |
| `basicuser` | Renter | Standard resident access — can book and view own rentals |

> Passwords are not listed here. Contact the project owner for credentials.

---

## Known Limitations

- **No payment processing** — the app tracks payment status and receipt numbers manually, but does not process real payments. An admin must mark rentals as paid after receiving payment offline. Users are instructed to call city hall after submitting a rental request.
- **MemoryStore sessions** — the app uses Express's default in-memory session store. This is not production-grade and will not persist sessions across server restarts or scale beyond a single process. A persistent session store (e.g. Redis or Firestore-backed) would be needed for a true production deployment.

---

## Tech Stack

- **Backend:** Node.js, Express.js (ES Modules)
- **Templating:** EJS
- **Database:** Firebase Firestore
- **Auth:** express-session, bcrypt
- **Frontend:** Bootstrap 5, Bootstrap Icons, Flatpickr
- **Validation:** express-validator
- **Deployment:** Render
