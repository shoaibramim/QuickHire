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
- [Deployment](#deployment)

---

## Overview

QuickHire is a monorepo containing two independently runnable applications:

| App | Directory | Description |
|---|---|---|
| Frontend | `/` (root) | Next.js 16 App Router, server-rendered React UI |
| Backend | `/server` | Express.js 5 REST API with MongoDB and JWT auth |

Key features:

- Public job board with full-text search and filtering by category, location, and employment type
- Employer dashboard with job management, applicant tracking with status labels (Pending, Reviewed, Shortlisted, Rejected), messaging inbox, and a schedule calendar
- Role-based access control with three roles: `jobseeker`, `employer`, `admin`
- Stateless JWT authentication via Bearer tokens, with Next.js Edge Middleware protecting dashboard routes before page render
- In-browser image cropping for company logos with base64 storage (up to 2 MB)
- Newsletter subscriber management
- Rate limiting (100 requests per 15-minute window per IP) and secure HTTP headers via Helmet

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js (App Router) | ^16.1.6 | SSR/SSG framework |
| React | ^19.2.4 | UI library |
| TypeScript | ^5.9.3 | Static typing |
| Tailwind CSS | ^4.2.1 | Utility-first styling |
| Recharts | ^3.7.0 | Dashboard statistics charts |
| react-easy-crop | ^5.5.6 | In-browser image cropping for avatars and logos |
| react-icons | ^5.5.0 | Icon set |
| Plus Jakarta Sans | — | Global font (via `next/font`) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Express.js | ^5.2.1 | HTTP server and REST API |
| TypeScript | ^5.9.3 | Static typing |
| Mongoose | ^9.2.3 | MongoDB ODM |
| Passport.js | ^0.7.0 | Authentication framework |
| passport-local | ^1.0.0 | Email/password login strategy |
| passport-jwt | ^4.0.1 | JWT Bearer token strategy |
| jsonwebtoken | ^9.0.3 | JWT signing and verification |
| bcryptjs | ^3.0.3 | Password hashing (cost factor 12) |
| helmet | ^8.1.0 | Secure HTTP response headers |
| express-rate-limit | ^8.2.1 | 100 requests per 15-minute window per IP |
| express-validator | ^7.3.1 | Request body validation |
| cors | ^2.8.6 | Cross-origin resource sharing |
| cookie-parser | ^1.4.7 | Cookie parsing middleware |
| dotenv | ^17.3.1 | Environment variable loading |
| nodemon + ts-node | — | Development hot-reload |

---

## Project Structure

```
QuickHire/
├── src/                          # Next.js frontend source
│   ├── app/
│   │   ├── (public)/             # Public pages: landing, jobs, companies, pricing, etc.
│   │   ├── (dashboard)/          # Employer dashboard (protected by Edge Middleware)
│   │   │   └── dashboard/
│   │   │       ├── page.tsx      # Overview / stats
│   │   │       ├── applicants/
│   │   │       ├── job-listing/
│   │   │       ├── messages/
│   │   │       ├── schedule/
│   │   │       ├── profile/
│   │   │       ├── settings/
│   │   │       └── help/
│   │   └── api/                  # Next.js route handlers (job apply proxy)
│   ├── components/               # Reusable UI components
│   │   ├── auth/                 # AuthModal, SignInForm, SignUpLockedPanel
│   │   ├── dashboard/            # Sidebar, TopBar, JobStatisticsChart
│   │   ├── home/                 # HeroSection, FeaturedJobsSection, LatestJobsSection, etc.
│   │   ├── jobs/                 # ApplyButton, ApplyForm, JobsFilterBar
│   │   ├── layout/               # Navbar, Footer, MobileNav, NavigationProgress
│   │   └── ui/                   # Button, Logo, RichTextEditor, ImageCropModal, etc.
│   ├── context/                  # AuthContext (React Context + localStorage token)
│   ├── hooks/                    # useApiData, useAuth
│   ├── services/                 # apiClient (fetch wrapper), authService, jobsService
│   ├── types/                    # Shared TypeScript interfaces
│   ├── constants/                # siteData, dashboardNav, capitals
│   └── middleware.ts             # Next.js Edge Middleware — dashboard route guard
├── server/                       # Express.js backend
│   ├── src/
│   │   ├── app.ts                # Express app setup (middleware + routes)
│   │   ├── index.ts              # Server entry point (MongoDB connect + listen)
│   │   ├── config/
│   │   │   └── passport.ts       # passport-local and passport-jwt strategies
│   │   ├── middleware/
│   │   │   ├── auth.ts           # requireAuth and requireRole middleware
│   │   │   └── errorHandler.ts   # Global error handler
│   │   ├── models/               # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Job.ts
│   │   │   ├── Application.ts
│   │   │   ├── Message.ts
│   │   │   ├── ScheduleEvent.ts
│   │   │   └── Subscriber.ts
│   │   └── routes/               # Express route handlers
│   │       ├── auth.ts
│   │       ├── jobs.ts
│   │       ├── dashboard.ts
│   │       ├── messages.ts
│   │       ├── schedule.ts
│   │       └── newsletter.ts
│   ├── scripts/
│   │   └── seed.ts               # Database seed script
│   ├── api/
│   │   └── index.ts              # Vercel serverless entry point
│   └── vercel.json               # Vercel deployment config for the backend
├── public/                       # Static assets
├── next.config.ts
└── package.json
```

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A MongoDB Atlas cluster or a local MongoDB instance

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
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Token expiry duration (e.g. `15m`, `1h`) |
| `CLIENT_ORIGIN` | Yes | — | Frontend origin allowed by CORS (e.g. `http://localhost:3000`) |
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
# Frontend (from the root directory)
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

This drops all existing collections and inserts fresh demo data including 10 employer accounts, jobs across 8 categories, applications, messages, and schedule events.

### 5. Start the development servers

Open two terminal windows and run each command in a separate terminal:

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
| `dev` | `next dev` | Start the Next.js development server |
| `build` | `next build` | Build for production |
| `start` | `next start` | Run the production build |
| `lint` | `next lint` | Run ESLint |

### Backend (`/server`)

| Script | Command | Description |
|---|---|---|
| `dev` | `nodemon --exec ts-node src/index.ts` | Start the server with hot reload |
| `build` | `tsc` | Compile TypeScript to `/server/dist` |
| `start` | `node dist/index.js` | Run the compiled production server |
| `seed` | `ts-node scripts/seed.ts` | Drop all collections and insert demo data |

---

## API Reference

All API routes are prefixed with `/api`.

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user. Body: `{ name, email, password, role? }`. Returns `{ user, token, expiresIn }` |
| `POST` | `/auth/login` | Public | Login. Body: `{ email, password }`. Returns `{ user, token, expiresIn }` |
| `GET` | `/auth/me` | JWT | Returns the authenticated user's profile |
| `POST` | `/auth/logout` | JWT | Stateless logout (client discards token) |

### Jobs

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/jobs` | Public | Browse active jobs. Query params: `q`, `category`, `location`, `type`, `featured` |
| `GET` | `/jobs/featured` | Public | Latest 8 featured active jobs |
| `GET` | `/jobs/latest` | Public | Latest 10 active jobs |
| `GET` | `/jobs/categories` | Public | Tag counts aggregated across all active jobs |
| `GET` | `/jobs/:id` | Public | Single job detail |
| `POST` | `/jobs/:id/apply` | Public | Submit an application. Body: `{ name, email, resume_link, cover_note? }` |

### Dashboard (Employer and Admin only)

| Method | Route | Description |
|---|---|---|
| `GET` | `/dashboard/overview` | Summary stats: pending candidates, unread messages, open jobs, schedule count, 7-day chart data, and applicant breakdown by employment type |
| `GET` | `/dashboard/jobs` | All job listings belonging to the authenticated employer |
| `GET` | `/dashboard/jobs/:id` | Single job detail (scoped to the employer) |
| `POST` | `/dashboard/jobs` | Create a new job listing |
| `PATCH` | `/dashboard/jobs/:id` | Update job fields (title, location, employmentType, description, tags, status) |
| `PATCH` | `/dashboard/jobs/:id/status` | Set job status to `Active`, `Closed`, or `Draft` |
| `GET` | `/dashboard/applicants` | All applications across the employer's jobs, enriched with job title |
| `PATCH` | `/dashboard/applicants/:id/status` | Update application status to `Pending`, `Reviewed`, `Shortlisted`, or `Rejected` |
| `GET` | `/dashboard/messages` | Employer message inbox, sorted by most recent |
| `PATCH` | `/dashboard/messages/:id/read` | Mark a message as read |
| `GET` | `/dashboard/schedule` | All schedule events for the authenticated employer |
| `POST` | `/dashboard/schedule` | Create a schedule event. Body: `{ title, time, date, type, withPerson? }` |
| `DELETE` | `/dashboard/schedule/:id` | Delete a schedule event |
| `GET` | `/dashboard/profile` | Employer profile (excludes passwordHash) |
| `PUT` | `/dashboard/profile` | Update profile fields and company logo (base64, max 2 MB) |

### Newsletter

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/newsletter/subscribe` | Public | Subscribe an email address. Body: `{ email }` |

---

## Database Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `passwordHash` | String | `select: false` — never returned in API responses |
| `role` | `jobseeker \| employer \| admin` | Default: `jobseeker` |
| `avatar` | String | Base64 data URI or URL |
| `company` | String | Employer company name |
| `companyLogo` | String | Base64 data URI or URL, max 2 MB |
| `industry`, `website`, `location`, `companySize`, `about`, `phone` | String | Extended employer profile fields |

### Job

| Field | Type | Notes |
|---|---|---|
| `title`, `company`, `location`, `employmentType` | String | Required |
| `companyLogoKey` | String | Static logo key; overridden by `postedBy.companyLogo` at query time |
| `tags` | String[] | Category tags used for filtering |
| `description` | String | Rich text HTML |
| `postedBy` | ObjectId (User) | Reference to the employer |
| `status` | `Active \| Closed \| Draft` | Default: `Active` |
| `featured` | Boolean | Default: `false` |
| `applicantCount` | Number | Incremented on each application submission |

### Application

| Field | Type | Notes |
|---|---|---|
| `jobId` | ObjectId (Job) | Required |
| `name`, `email`, `resumeLink` | String | Required; `resumeLink` must be a valid `http`/`https` URL |
| `coverNote` | String | Optional |
| `status` | `Pending \| Reviewed \| Shortlisted \| Rejected` | Default: `Pending` |

### Message

| Field | Type | Notes |
|---|---|---|
| `ownerId` | ObjectId (User) | Employer who owns this inbox message |
| `from` | String | Sender display name |
| `avatar` | String | Optional sender avatar URL |
| `preview` | String | Short message preview |
| `fullText` | String | Optional full message body |
| `unread` | Boolean | Default: `true` |
| `time` | String | Human-readable timestamp string (e.g. `"2h ago"`) |

### ScheduleEvent

| Field | Type | Notes |
|---|---|---|
| `ownerId` | ObjectId (User) | Employer owner |
| `title` | String | Required |
| `time` | String | e.g. `"10:00 AM"` |
| `date` | String | e.g. `"Mar 2, 2026"` |
| `type` | `Interview \| Meeting \| Review` | Required |
| `withPerson` | String | Optional — name of the other participant |

### Subscriber

| Field | Type | Notes |
|---|---|---|
| `email` | String | Required, unique, lowercase |
| `subscribedAt` | Date | Set automatically on creation |

---

## Authentication

- **Strategy:** Stateless JWT via Bearer token in the `Authorization` header
- **Login flow:** `POST /api/auth/login` returns a signed JWT valid for 15 minutes (configurable via `JWT_ACCESS_EXPIRES_IN`)
- **Token storage:** Browser `localStorage` under the key `qh_token`
- **Protected API routes:** Include the token in every request as `Authorization: Bearer <token>`
- **Protected page routes:** Next.js Edge Middleware (`src/middleware.ts`) checks for the token in the `qh_token` cookie or the `Authorization` header before the page renders; unauthenticated requests are redirected to `/?signin=required`
- **Role enforcement:** The `requireRole(["employer", "admin"])` middleware returns `403` for users with insufficient permissions
- **Password hashing:** bcryptjs with a cost factor of 12

---

## Deployment

### Backend (Vercel)

The `server/` directory includes a `vercel.json` that configures the Express app as a Vercel serverless function. All requests are routed through `server/api/index.ts`.

```json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }]
}
```

Set the same environment variables listed in `server/.env` as Vercel project environment variables.

### Frontend (Vercel)

Deploy the root directory as a standard Next.js project on Vercel. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
