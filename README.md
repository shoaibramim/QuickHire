# QuickHire

A full-stack job board platform where employers can post positions and manage applicants, and job seekers can browse and apply for opportunities.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Authentication](#authentication)

---

## Overview

QuickHire is a monorepo containing two independently runnable applications:

| App | Directory | Description |
|---|---|---|
| Frontend | `/` (root) | Next.js 15 App Router, server-rendered React UI |
| Backend | `/server` | Express.js REST API with MongoDB + JWT auth |

**Key features:**
- Public job board with search, filtering by category, location, and type
- Employer dashboard with job management, applicant tracking, messaging, and scheduling
- Role-based access control — `jobseeker`, `employer`, `admin`
- Stateless JWT authentication via Bearer tokens
- Image cropping for company logos
- Newsletter subscription
- Rate limiting and secure HTTP headers

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | SSR/SSG framework |
| React 19 | UI library |
| TypeScript 5 | Static typing |
| Tailwind CSS 4 | Utility-first styling |
| Recharts | Dashboard statistics charts |
| react-easy-crop | Avatar and logo image cropping |
| react-icons | Icon set |
| Plus Jakarta Sans | Global font (via `next/font`) |

### Backend

| Technology | Purpose |
|---|---|
| Express.js 5 | HTTP server and REST API |
| TypeScript 5 | Static typing |
| MongoDB + Mongoose | Database and ODM |
| Passport.js | Authentication framework |
| passport-local | Email/password strategy |
| passport-jwt | JWT bearer token strategy |
| jsonwebtoken | JWT signing and verification |
| bcryptjs | Password hashing (bcrypt, cost 12) |
| helmet | Secure HTTP response headers |
| express-rate-limit | 100 requests per 15-minute window per IP |
| express-validator | Request body validation |
| cors | Cross-origin resource sharing |

---

## Project Structure

```
QuickHire/
├── src/                        # Next.js frontend source
│   ├── app/
│   │   ├── (public)/           # Landing page, jobs, companies, pricing, etc.
│   │   └── (dashboard)/        # Employer dashboard (protected)
│   ├── components/             # Reusable UI components
│   ├── context/                # React Context (AuthContext)
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API client and service helpers
│   ├── types/                  # Shared TypeScript types
│   └── constants/              # Site data and nav constants
├── server/                     # Express.js backend
│   ├── src/
│   │   ├── config/             # Passport strategy configuration
│   │   ├── middleware/         # Auth and error handler middleware
│   │   ├── models/             # Mongoose models
│   │   └── routes/             # Express route handlers
│   └── scripts/
│       └── seed.ts             # Database seed script
├── public/                     # Static assets
├── next.config.ts
└── package.json
```

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A MongoDB Atlas cluster (or a local MongoDB instance)

---

## Environment Variables

### Backend — `server/.env`

Create a file at `server/.env` with the following variables:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_ACCESS_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRES_IN=15m
CLIENT_ORIGIN=http://localhost:3000
PORT=5000
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | — | MongoDB Atlas (or local) connection string |
| `JWT_ACCESS_SECRET` | Yes | — | Secret used to sign JWT access tokens |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Token expiry duration |
| `CLIENT_ORIGIN` | Yes | — | Frontend origin allowed by CORS |
| `PORT` | No | `5000` | Port the Express server listens on |

### Frontend — `.env.local`

Create a file at `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:5000/api` | Express API base URL used by the browser |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shoaibramim/QuickHire.git
cd QuickHire
```

### 2. Install dependencies

Install frontend and backend dependencies separately:

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Configure environment variables

Create `server/.env` and `.env.local` as described in the [Environment Variables](#environment-variables) section above.

### 4. (Optional) Seed the database

Populate the database with sample employers, jobs, applications, messages, and schedule events:

```bash
cd server
npm run seed
```

This clears all existing collections and inserts fresh demo data including 10 employer accounts and jobs across 8 categories.

### 5. Start the development servers

Open two terminal windows and run each command in a separate one:

```bash
# Terminal 1 — Backend (from the /server directory)
cd server
npm run dev

# Terminal 2 — Frontend (from the root directory)
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |

---

## Available Scripts

### Frontend (root)

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start Next.js development server |
| `build` | `next build` | Build for production |
| `start` | `next start` | Run the production build |
| `lint` | `next lint` | Run ESLint |

### Backend (`/server`)

| Script | Command | Description |
|---|---|---|
| `dev` | `nodemon --exec ts-node src/index.ts` | Start server with hot reload |
| `build` | `tsc` | Compile TypeScript to `/server/dist` |
| `start` | `node dist/index.js` | Run the compiled production server |
| `seed` | `ts-node scripts/seed.ts` | Seed the database with demo data |

---

## API Reference

All API routes are prefixed with `/api`.

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user. Body: `{ name, email, password }` |
| `POST` | `/auth/login` | Public | Login. Body: `{ email, password }`. Returns `{ user, token, expiresIn }` |
| `GET` | `/auth/me` | JWT | Returns the authenticated user's profile |
| `POST` | `/auth/logout` | JWT | Stateless logout (client discards token) |

### Jobs

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/jobs` | Public | Browse all active jobs. Query: `q`, `category`, `location`, `type`, `featured` |
| `GET` | `/jobs/featured` | Public | Latest 8 featured active jobs |
| `GET` | `/jobs/latest` | Public | Latest 10 active jobs |
| `GET` | `/jobs/categories` | Public | Aggregated tag counts across active jobs |
| `GET` | `/jobs/:id` | Public | Single job detail |
| `POST` | `/jobs/:id/apply` | Public | Submit an application for a job |
| `POST` | `/jobs` | Employer/Admin | Create a new job posting |

### Dashboard (Employer/Admin only)

| Method | Route | Description |
|---|---|---|
| `GET` | `/dashboard/overview` | Summary stats: candidates, messages, schedule, open jobs, chart data |
| `GET` | `/dashboard/jobs` | Employer's own job listings |
| `GET` | `/dashboard/jobs/:id` | Single job detail for editing |
| `GET` | `/dashboard/messages` | Employer inbox |
| `POST` | `/dashboard/messages` | Create a message |
| `GET` | `/dashboard/schedule` | Upcoming schedule events |
| `POST` | `/dashboard/schedule` | Create a schedule event |

### Other

| Method | Route | Description |
|---|---|---|
| `POST` | `/newsletter` | Subscribe an email to the newsletter |

---

## Database Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `passwordHash` | String | `select: false` — never returned in API responses |
| `role` | `jobseeker \| employer \| admin` | Default: `jobseeker` |
| `avatar` | String | Base64 or URL |
| `company`, `companyLogo` | String | Employer profile fields |
| `industry`, `website`, `location`, `companySize`, `about`, `phone` | String | Extended employer profile |

### Job

| Field | Type | Notes |
|---|---|---|
| `title`, `company`, `location`, `employmentType` | String | Required |
| `tags` | String[] | Used for category filtering |
| `description` | String | Rich text HTML |
| `postedBy` | ObjectId (User) | Employer reference |
| `status` | `Active \| Closed \| Draft` | Default: `Active` |
| `featured` | Boolean | Default: `false` |
| `applicantCount` | Number | Incremented on each application |

### Application

| Field | Type | Notes |
|---|---|---|
| `jobId` | ObjectId (Job) | Required |
| `name`, `email`, `resumeLink` | String | Required |
| `coverNote` | String | Optional |
| `status` | `Pending \| Reviewed \| Shortlisted \| Rejected` | Default: `Pending` |

### ScheduleEvent

| Field | Type | Notes |
|---|---|---|
| `ownerId` | ObjectId (User) | Employer owner |
| `title`, `time`, `date` | String | e.g. `"10:00 AM"`, `"Mar 2, 2026"` |
| `type` | `Interview \| Meeting \| Review` | Required |
| `withPerson` | String | Optional |

---

## Authentication

- **Strategy:** Stateless JWT via Bearer token in the `Authorization` header
- **Login flow:** `POST /api/auth/login` returns a signed JWT valid for 15 minutes (configurable via `JWT_ACCESS_EXPIRES_IN`)
- **Token storage:** Browser `localStorage` under the key `qh_token`
- **Protected routes:** Pass the token in every request as `Authorization: Bearer <token>`
- **Role enforcement:** `requireRole(["employer", "admin"])` middleware returns `403` for unauthorized roles
