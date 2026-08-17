# 🛠️ LocalFix — Full-Stack On-Demand Local Service Marketplace

> A modern, role-based service booking and technician management platform built on the **MERN** stack (MongoDB, Express, React, Node.js) with AI-assisted trade classification, conflict-free scheduling, in-app real-time notifications, and a dedicated Super Admin operations portal.

---

## 🌟 Key Features

- 👤 **Customer Portal**: Book home & commercial services, AI problem categorization, live 5-step status progression, ratings & reviews, and issue ticket tracking.
- 🔧 **Provider Portal**: Profile onboarding, Super Admin verification shield, available jobs feed, conflict-free job acceptance, auto-busy capacity management, and earnings tracker.
- 🛡️ **Super Admin Operations Portal (`/admin`)**: Real-time KPI cards, provider verification approval/rejection, booking status overrides, dispute & complaint resolution hub, and system-wide broadcast notification tool.
- 🔔 **Multi-Role Real-Time Notification Center**: Interactive bell popover with unread counters, filter tabs (`All` / `Unread`), time-ago formatting, and automatic triggers on bookings, status changes, verifications, and broadcasts.
- 🤖 **AI-Assisted Classification**: Automatically categorizes natural language problem descriptions into appropriate trade categories with fallback heuristics.
- 🔒 **Stateless JWT Authentication (RBAC)**: Encrypted password hashing with `bcryptjs` (salt rounds: 10) and secure route guards across all roles.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, React Router v6, React-Bootstrap, Bootstrap Icons, Context API (`AuthContext`)
- **Backend**: Node.js, Express.js (RESTful API architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt.js
- **Styling**: Modern responsive CSS & Bootstrap 5

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/localfix.git
cd localfix
```

### 2. Install Dependencies
```bash
# Install frontend and root dependencies
npm install

# Install backend dependencies
npm --prefix backend install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend/` directory (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/localfix
JWT_SECRET=localfix_jwt_secret_key_2026_super_secure_auth
JWT_EXPIRES_IN=7d
AI_API_KEY=your_gemini_api_key_optional
```

### 4. Run the Full Application
```bash
# Starts both Express backend (Port 5000) and React frontend (Port 3000) concurrently
npm start
```

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 📂 Project Structure

```
localfix/
├── backend/
│   ├── config/             # Database connection (db.js)
│   ├── controllers/        # Business logic (auth, requests, providers, support, notifications, reviews)
│   ├── middleware/         # JWT authentication & RBAC guards (authMiddleware.js)
│   ├── models/             # Mongoose schemas (User, Provider, ServiceRequest, SupportTicket, Notification, Review)
│   ├── routes/             # REST API endpoint routes
│   ├── utils/              # AI classifier & Notification dispatcher
│   ├── .env.example        # Environment variable template
│   └── server.js           # Express app entry point
├── src/
│   ├── components/         # Reusable UI (Navbar, Sidebar, NotificationDropdown, Cards, etc.)
│   ├── context/            # Global React AuthContext (state & tokens)
│   ├── data/               # Static services and FAQ datasets
│   ├── pages/              # Role-based views (Home, Login, Register, Dashboards, Admin, Support, etc.)
│   ├── services/           # Centralized API service bridge (api.js)
│   ├── App.js              # Application routing layer
│   └── App.css             # Component and design system styling
├── package.json
└── README.md
```

---

## 🔑 Default Roles & Access

- **Public Routes**: `/`, `/services`, `/how-it-works`, `/become-a-provider`, `/help`, `/login`, `/register`
- **Customer Routes**: `/dashboard`, `/requests`, `/request`, `/profile`, `/help`
- **Provider Routes**: `/provider/dashboard`, `/provider/requests`, `/provider/jobs`, `/provider/profile`, `/provider/help`
- **Super Admin Portal**: `/admin` (Requires `role: "admin"`)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
