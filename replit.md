# JUSPAY Payment System

## Project Overview
A full-stack wallet-based payment system where users can register, log in, send money, and view transaction history.

## Architecture
- **Frontend**: React + Vite + TypeScript + Tailwind CSS v4 (port 5000)
- **Backend**: Spring Boot 4.x (Java, GraalVM 19) on port 8080
- **Database**: MongoDB 7.0 (local, port 27017)
- **Auth**: JWT-based authentication
- **Workflows**: 3 workflows run simultaneously (MongoDB → Backend API → Start application)

## Default Admin Account
- **Email**: admin@example.com
- **Password**: admin@2004
- **Admin Portal**: Navigate to `/admin` in the app

## Project Structure
```
frontend/           # React + Vite app
  src/
    api/            # Axios HTTP client (baseURL: /api — proxied via Vite to backend)
    components/     # Reusable UI components (Navbar, SendMoney, RecentTransactions)
    pages/          # Page components (Dashboard, Login, Register, AdminLogin, AdminDashboard)
    store/          # Zustand state management (authStore)
    App.tsx         # Main app + routes
    index.css       # Tailwind v4 CSS with custom teal theme (@theme block)
  vite.config.ts    # Vite config: host 0.0.0.0, port 5000, allowedHosts: true, proxy /api → 8080

backend/            # Spring Boot application
  src/main/java/com/juspay/backend/
    controller/     # REST API controllers (Auth, User, Transaction, Admin)
    domain/         # Entity models (User, Transaction, Wallet, OTPRecord)
    dto/            # Data Transfer Objects
    repository/     # MongoDB repositories
    security/       # JWT + Spring Security config
    service/        # Business logic (Auth, Email, Transaction)
  src/main/resources/application.yml  # Config (MongoDB localhost, Kafka disabled, JWT)
  pom.xml           # Maven build config (Spring Boot 4.0.5)
  target/           # Compiled JAR (backend-0.0.1-SNAPSHOT.jar)

mongodb/bin/mongod  # MongoDB 7.0.16 binary (downloaded from mongodb.com)
mongodb-data/       # MongoDB data directory (persistent, gitignored)
```

## Running the App
Three workflows must run in order:
1. **MongoDB**: `./mongodb/bin/mongod --dbpath ./mongodb-data --port 27017 --bind_ip 127.0.0.1`
2. **Backend API**: `java -jar backend/target/backend-0.0.1-SNAPSHOT.jar` (port 8080)
3. **Start application**: `cd frontend && npm run dev` (port 5000)

## Key Configuration
- MongoDB: local `mongodb://localhost:27017/juspay`
- JWT secret configured in `backend/src/main/resources/application.yml`
- Kafka: disabled (listener.auto-startup=false) — transactions processed synchronously
- Frontend API: Vite proxy forwards `/api` requests to `http://localhost:8080`
- Email (Gmail SMTP): configured — OTP also logged to backend console as fallback

## API Endpoints
- `POST /api/auth/register` — Register (triggers OTP email)
- `POST /api/auth/verify-otp` — Verify OTP and create account
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/transactions/wallet` — Get current wallet
- `GET /api/transactions/history` — Transaction history
- `POST /api/transactions/send` — Send money by UPI ID
- `GET /api/users/search?query=` — Search users
- `POST /api/admin/add-funds/{userId}?amount=` — Admin: add funds

## Deployment
- Configured as static deployment (build: `cd frontend && npm run build`, publicDir: `frontend/dist`)
- Note: Backend (Spring Boot) and MongoDB are not part of static deployment — they run only in dev
