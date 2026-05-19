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

| App      | Directory  | Description                                     |
| -------- | ---------- | ----------------------------------------------- |
| Frontend | `/` (root) | Next.js 16 App Router, server-rendered React UI |
| Backend  | `/server`  | Express.js 5 REST API with MongoDB and JWT auth |

Key features:

- Public job board with search, filters (category, location, company, type), featured/latest feeds, and job suggestions
- Job applications with resume links, duplicate-apply protection, and application status checks
- Employer dashboard with job CRUD, featured job limits, applicant pipeline statuses, analytics (job views + applications), messaging, and schedule calendar
- Job seeker dashboard with application timeline, shortlist/pending stats, and recommended jobs
- Real-time employer and job-seeker messaging powered by Socket.io
- Company directory with open role counts and profile details
- Role-based access control with three roles: `jobseeker`, `employer`, `admin`
- Email verification via OTP or magic link before login access
- Stateless JWT authentication via Bearer tokens, with Next.js Edge Middleware protecting dashboard routes before page render
- Profile management for employers and job seekers, including base64 company logo uploads (max 2 MB) and avatars
- Newsletter subscriber management and contact form delivery
- Rate limiting (100 requests per 15-minute window per IP) and secure HTTP headers via Helmet

---

## Tech Stack

### Frontend

| Technology           | Version | Purpose                                         |
| -------------------- | ------- | ----------------------------------------------- |
| Next.js (App Router) | ^16.1.6 | SSR/SSG framework                               |
| React                | ^19.2.4 | UI library                                      |
| TypeScript           | ^5.9.3  | Static typing                                   |
| Tailwind CSS         | ^4.2.1  | Utility-first styling                           |
| Recharts             | ^3.7.0  | Dashboard statistics charts                     |
| react-easy-crop      | ^5.5.6  | In-browser image cropping for avatars and logos |
| react-icons          | ^5.5.0  | Icon set                                        |
| socket.io-client     | ^4.8.1  | Realtime messaging                              |
| Plus Jakarta Sans    | —       | Global font (via `next/font`)                   |

### Backend

| Technology         | Version | Purpose                                  |
| ------------------ | ------- | ---------------------------------------- |
| Express.js         | ^5.2.1  | HTTP server and REST API                 |
| TypeScript         | ^5.9.3  | Static typing                            |
| Mongoose           | ^9.2.3  | MongoDB ODM                              |
| Passport.js        | ^0.7.0  | Authentication framework                 |
| passport-local     | ^1.0.0  | Email/password login strategy            |
| passport-jwt       | ^4.0.1  | JWT Bearer token strategy                |
| jsonwebtoken       | ^9.0.3  | JWT signing and verification             |
| bcryptjs           | ^3.0.3  | Password hashing (cost factor 12)        |
| helmet             | ^8.1.0  | Secure HTTP response headers             |
| express-rate-limit | ^8.2.1  | 100 requests per 15-minute window per IP |
| express-validator  | ^7.3.1  | Request body validation                  |
| cors               | ^2.8.6  | Cross-origin resource sharing            |
| cookie-parser      | ^1.4.7  | Cookie parsing middleware                |
| dotenv             | ^17.3.1 | Environment variable loading             |
| socket.io          | ^4.8.1  | Realtime messaging server                |
| nodemailer         | ^8.0.7  | Verification email delivery              |
| nodemon + ts-node  | —       | Development hot-reload                   |

---

## Project Structure

```
QuickHire/
├── Page UI References/          # Design references
├── public/                      # Static assets
├── server/                      # Express.js backend
│   ├── api/                      # Vercel serverless entry point
│   │   └── index.ts
│   ├── scripts/                  # Database seed script
│   │   └── seed.ts
│   ├── src/
│   │   ├── app.ts                # Express app setup (middleware + routes)
│   │   ├── index.ts              # Server entry point (MongoDB + Socket.io)
│   │   ├── socket.ts             # Socket.io auth and emit helpers
│   │   ├── config/
│   │   │   └── passport.ts       # passport-local and passport-jwt strategies
│   │   ├── middleware/
│   │   │   ├── auth.ts           # requireAuth and requireRole middleware
│   │   │   └── errorHandler.ts   # Global error handler
│   │   ├── models/               # Mongoose models
│   │   │   ├── Application.ts
│   │   │   ├── Conversation.ts
│   │   │   ├── Job.ts
│   │   │   ├── JobView.ts
│   │   │   ├── Message.ts
│   │   │   ├── ScheduleEvent.ts
│   │   │   ├── Subscriber.ts
│   │   │   └── User.ts
│   │   ├── routes/               # Express route handlers
│   │   │   ├── auth.ts
│   │   │   ├── companies.ts
│   │   │   ├── contact.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── jobSeekerDashboard.ts
│   │   │   ├── jobs.ts
│   │   │   ├── messages.ts
│   │   │   ├── newsletter.ts
│   │   │   └── schedule.ts
│   │   └── services/
│   │       └── emailVerification.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json               # Vercel deployment config for the backend
├── src/                         # Next.js frontend source
│   ├── app/
│   │   ├── (public)/             # Public pages: landing, jobs, companies, pricing, etc.
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   └── api/                  # Next.js route handlers
│   ├── components/              # Reusable UI components
│   │   ├── auth/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── home/
│   │   ├── jobs/
│   │   ├── layout/
│   │   └── ui/
│   ├── constants/                # siteData, dashboardNav, capitals
│   ├── context/                  # AuthContext
│   ├── hooks/                    # useApiData, useAuth
│   ├── services/                 # apiClient, authService, jobsService
│   ├── types/                    # Shared TypeScript interfaces
│   └── middleware.ts             # Next.js Edge Middleware — dashboard guard
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
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
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=QuickHire <no-reply@quickhire.local>
```

| Variable                | Required | Default | Description                                                    |
| ----------------------- | -------- | ------- | -------------------------------------------------------------- |
| `MONGODB_URI`           | Yes      | —       | MongoDB Atlas (or local) connection string                     |
| `JWT_ACCESS_SECRET`     | Yes      | —       | Secret used to sign JWT access tokens                          |
| `JWT_ACCESS_EXPIRES_IN` | No       | `15m`   | Token expiry duration (e.g. `15m`, `1h`)                       |
| `CLIENT_ORIGIN`         | Yes      | —       | Frontend origin allowed by CORS (e.g. `http://localhost:3000`) |
| `PORT`                  | No       | `5000`  | Port the Express server listens on                             |
| `SMTP_HOST`             | No       | —       | SMTP server host for verification emails                       |
| `SMTP_PORT`             | No       | `587`   | SMTP server port                                               |
| `SMTP_SECURE`           | No       | `false` | Use TLS for SMTP transport                                     |
| `SMTP_USER`             | No       | —       | SMTP username                                                  |
| `SMTP_PASS`             | No       | —       | SMTP password                                                  |
| `SMTP_FROM`             | No       | —       | From address for verification emails                           |

Notes:

- `CLIENT_ORIGIN` can be a comma-separated list of allowed origins.
- If SMTP variables are omitted, verification emails are suppressed in development.

### Frontend — `.env.local`

Create a file at `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

| Variable              | Required | Default                     | Description                              |
| --------------------- | -------- | --------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_URL` | No       | `http://localhost:5000/api` | Express API base URL used by the browser |

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

| Service     | URL                       |
| ----------- | ------------------------- |
| Frontend    | http://localhost:3000     |
| Backend API | http://localhost:5000/api |

---

## Available Scripts

### Frontend (root)

| Script  | Command      | Description                          |
| ------- | ------------ | ------------------------------------ |
| `dev`   | `next dev`   | Start the Next.js development server |
| `build` | `next build` | Build for production                 |
| `start` | `next start` | Run the production build             |
| `lint`  | `next lint`  | Run ESLint                           |

### Backend (`/server`)

| Script  | Command                               | Description                               |
| ------- | ------------------------------------- | ----------------------------------------- |
| `dev`   | `nodemon --exec ts-node src/index.ts` | Start the server with hot reload          |
| `build` | `tsc`                                 | Compile TypeScript to `/server/dist`      |
| `start` | `node dist/index.js`                  | Run the compiled production server        |
| `seed`  | `ts-node scripts/seed.ts`             | Drop all collections and insert demo data |

---

## API Reference

All API routes are prefixed with `/api`.

### Auth

| Method  | Route                       | Auth   | Description                                                                                                                                                                                           |
| ------- | --------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`  | `/auth/register`            | Public | Register a new user. Body: `{ name, email, password, role? }`. Creates a pending account and sends both an OTP and a verification link by email                                                       |
| `POST`  | `/auth/verify-email`        | Public | Verify an account using `{ email, token? , otp? }`. Returns `{ user, token, expiresIn }`                                                                                                              |
| `POST`  | `/auth/resend-verification` | Public | Resend the verification email for an unverified account                                                                                                                                               |
| `POST`  | `/auth/login`               | Public | Login. Body: `{ email, password }`. Verified users receive `{ user, token, expiresIn }`                                                                                                               |
| `GET`   | `/auth/me`                  | JWT    | Returns the authenticated user's profile                                                                                                                                                              |
| `GET`   | `/auth/profile`             | JWT    | Returns the authenticated user's profile (role-aware fields)                                                                                                                                          |
| `PUT`   | `/auth/profile`             | JWT    | Update profile fields. Job seekers: `{ name, phone, location, resumeLink, coverLetterTemplate }`. Employers: `{ name, phone, location, company, companyLogo, industry, website, companySize, about }` |
| `PATCH` | `/auth/password`            | JWT    | Update the current password. Body: `{ currentPassword, newPassword, confirmPassword }`                                                                                                                |
| `POST`  | `/auth/logout`              | JWT    | Stateless logout (client discards token)                                                                                                                                                              |

### Jobs

| Method | Route                          | Auth                   | Description                                                                                            |
| ------ | ------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `GET`  | `/jobs`                        | Public                 | Browse active jobs. Query: `q`, `category`, `location`, `company`, `type`, `featured`, `page`, `limit` |
| `GET`  | `/jobs/featured`               | Public                 | Latest 8 featured active jobs                                                                          |
| `GET`  | `/jobs/latest`                 | Public                 | Latest 10 active jobs                                                                                  |
| `GET`  | `/jobs/categories`             | Public                 | Tag counts aggregated across all active jobs                                                           |
| `GET`  | `/jobs/suggestions`            | Public                 | Query suggestions for the hero search (`q`)                                                            |
| `GET`  | `/jobs/count`                  | Public                 | Total matching jobs for filters                                                                        |
| `GET`  | `/jobs/:id`                    | Public                 | Single job detail (also records a view)                                                                |
| `GET`  | `/jobs/:id/application-status` | JWT (jobseeker, admin) | Check if the current job seeker already applied                                                        |
| `POST` | `/jobs/:id/apply`              | JWT (jobseeker, admin) | Submit an application. Body: `{ resume_link, cover_note? }`                                            |
| `POST` | `/jobs`                        | JWT (employer, admin)  | Create a new job listing                                                                               |

### Companies

| Method | Route        | Auth   | Description                                              |
| ------ | ------------ | ------ | -------------------------------------------------------- |
| `GET`  | `/companies` | Public | List companies with open role counts and profile details |

### Dashboard (Employer and Admin only)

| Method   | Route                              | Description                                                                                                                           |
| -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/dashboard/overview`              | Summary stats: pending candidates, unread messages, open jobs, schedule count, chart data, and applicant breakdown by employment type |
| `GET`    | `/dashboard/jobs`                  | All job listings belonging to the authenticated employer                                                                              |
| `GET`    | `/dashboard/jobs/:id`              | Single job detail (scoped to the employer)                                                                                            |
| `POST`   | `/dashboard/jobs`                  | Create a new job listing                                                                                                              |
| `PATCH`  | `/dashboard/jobs/:id`              | Update job fields (title, location, employmentType, description, tags, status, featured)                                              |
| `PATCH`  | `/dashboard/jobs/:id/status`       | Set job status to `Active`, `Closed`, or `Draft`                                                                                      |
| `GET`    | `/dashboard/applicants`            | All applications across the employer's jobs, enriched with job title                                                                  |
| `PATCH`  | `/dashboard/applicants/:id/status` | Update application status to `Pending`, `Reviewed`, `Shortlisted`, or `Rejected`                                                      |
| `GET`    | `/dashboard/profile`               | Employer profile (excludes passwordHash)                                                                                              |
| `PUT`    | `/dashboard/profile`               | Update profile fields and company logo (base64, max 2 MB)                                                                             |
| `GET`    | `/dashboard/schedule`              | All schedule events for the authenticated employer                                                                                    |
| `POST`   | `/dashboard/schedule`              | Create a schedule event. Body: `{ title, time, date, type, withPerson? }`                                                             |
| `DELETE` | `/dashboard/schedule/:id`          | Delete a schedule event                                                                                                               |

### Messaging (`/dashboard/messages`)

| Method  | Route                                        | Description                                        |
| ------- | -------------------------------------------- | -------------------------------------------------- |
| `GET`   | `/dashboard/messages`                        | List conversation summaries                        |
| `GET`   | `/dashboard/messages/:conversationId`        | List messages for a conversation                   |
| `POST`  | `/dashboard/messages/start`                  | Employer starts a conversation from an application |
| `POST`  | `/dashboard/messages`                        | Reply in an existing conversation                  |
| `PATCH` | `/dashboard/messages/:conversationId/read`   | Mark all messages in a conversation as read        |
| `PATCH` | `/dashboard/messages/:conversationId/unread` | Mark all messages in a conversation as unread      |
| `PATCH` | `/dashboard/messages/entries/:messageId`     | Edit a message within the allowed time window      |

### Dashboard (Job Seeker)

| Method | Route                        | Description                                                                                                                      |
| ------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/dashboard/seeker/overview` | Summary stats for job seekers: application counts, shortlist count, pending responses, recent applications, and recommended jobs |

### Newsletter

| Method | Route                   | Auth   | Description                                   |
| ------ | ----------------------- | ------ | --------------------------------------------- |
| `POST` | `/newsletter/subscribe` | Public | Subscribe an email address. Body: `{ email }` |

### Contact

| Method | Route      | Auth   | Description                                                        |
| ------ | ---------- | ------ | ------------------------------------------------------------------ |
| `POST` | `/contact` | Public | Send a contact message. Body: `{ name, email, subject?, message }` |

---

## Database Models

### User

| Field                                                              | Type                             | Notes                                                              |
| ------------------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------ |
| `name`                                                             | String                           | Required                                                           |
| `email`                                                            | String                           | Required, unique, lowercase                                        |
| `passwordHash`                                                     | String                           | `select: false` — never returned in API responses                  |
| `role`                                                             | `jobseeker \| employer \| admin` | Default: `jobseeker`                                               |
| `emailVerifiedAt`                                                  | Date                             | Set when the email verification link or OTP is confirmed           |
| `emailVerificationTokenHash`, `emailVerificationOtpHash`           | String                           | Hashed verification secrets stored server-side until use or expiry |
| `emailVerificationTokenExpiresAt`, `emailVerificationOtpExpiresAt` | Date                             | Verification expiry timestamps                                     |
| `emailVerificationSentAt`                                          | Date                             | Last verification email timestamp                                  |
| `avatar`                                                           | String                           | Base64 data URI or URL                                             |
| `company`                                                          | String                           | Employer company name                                              |
| `companyLogo`                                                      | String                           | Base64 data URI or URL, max 2 MB                                   |
| `industry`, `website`, `location`, `companySize`, `about`, `phone` | String                           | Extended employer profile fields                                   |
| `resumeLink`                                                       | String                           | Default resume link for job seekers                                |
| `coverLetterTemplate`                                              | String                           | Default cover letter for job seekers                               |

### Job

| Field                                            | Type                        | Notes                                                               |
| ------------------------------------------------ | --------------------------- | ------------------------------------------------------------------- |
| `title`, `company`, `location`, `employmentType` | String                      | Required                                                            |
| `companyLogoKey`                                 | String                      | Static logo key; overridden by `postedBy.companyLogo` at query time |
| `tags`                                           | String[]                    | Category tags used for filtering                                    |
| `description`                                    | String                      | Rich text HTML                                                      |
| `postedBy`                                       | ObjectId (User)             | Reference to the employer                                           |
| `status`                                         | `Active \| Closed \| Draft` | Default: `Active`                                                   |
| `featured`                                       | Boolean                     | Default: `false`                                                    |
| `applicantCount`                                 | Number                      | Incremented on each application submission                          |
| `jobViews`                                       | Number                      | Incremented when job details are viewed                             |

### Application

| Field                         | Type                                             | Notes                                                     |
| ----------------------------- | ------------------------------------------------ | --------------------------------------------------------- |
| `applicantId`                 | ObjectId (User)                                  | Job seeker who applied                                    |
| `jobId`                       | ObjectId (Job)                                   | Required                                                  |
| `name`, `email`, `resumeLink` | String                                           | Required; `resumeLink` must be a valid `http`/`https` URL |
| `coverNote`                   | String                                           | Optional                                                  |
| `status`                      | `Pending \| Reviewed \| Shortlisted \| Rejected` | Default: `Pending`                                        |

### Conversation

| Field                | Type                   | Notes                            |
| -------------------- | ---------------------- | -------------------------------- |
| `applicationId`      | ObjectId (Application) | One conversation per application |
| `jobId`              | ObjectId (Job)         | Related job                      |
| `employerId`         | ObjectId (User)        | Employer participant             |
| `jobSeekerId`        | ObjectId (User)        | Job seeker participant           |
| `jobTitle`           | String                 | Snapshot of the job title        |
| `companyName`        | String                 | Snapshot of the company name     |
| `jobSeekerName`      | String                 | Snapshot of the job seeker name  |
| `lastMessageAt`      | Date                   | Last message timestamp           |
| `lastMessagePreview` | String                 | Preview of the latest message    |
| `lastMessageId`      | ObjectId (Message)     | Latest message id                |

### Message

| Field            | Type                    | Notes                      |
| ---------------- | ----------------------- | -------------------------- |
| `conversationId` | ObjectId (Conversation) | Conversation reference     |
| `senderId`       | ObjectId (User)         | Sender id                  |
| `recipientId`    | ObjectId (User)         | Recipient id               |
| `body`           | String                  | Message body               |
| `preview`        | String                  | Short preview text         |
| `unread`         | Boolean                 | Default: `true`            |
| `editedAt`       | Date                    | Set when edited            |
| `createdAt`      | Date                    | Message creation timestamp |

### JobView

| Field       | Type           | Notes            |
| ----------- | -------------- | ---------------- |
| `jobId`     | ObjectId (Job) | Job being viewed |
| `createdAt` | Date           | View timestamp   |

### ScheduleEvent

| Field        | Type                             | Notes                                    |
| ------------ | -------------------------------- | ---------------------------------------- |
| `ownerId`    | ObjectId (User)                  | Employer owner                           |
| `title`      | String                           | Required                                 |
| `time`       | String                           | e.g. `"10:00 AM"`                        |
| `date`       | String                           | e.g. `"Mar 2, 2026"`                     |
| `type`       | `Interview \| Meeting \| Review` | Required                                 |
| `withPerson` | String                           | Optional — name of the other participant |

### Subscriber

| Field          | Type   | Notes                         |
| -------------- | ------ | ----------------------------- |
| `email`        | String | Required, unique, lowercase   |
| `subscribedAt` | Date   | Set automatically on creation |

---

## Authentication

- **Strategy:** Stateless JWT via Bearer token in the `Authorization` header
- **Signup flow:** `POST /api/auth/register` creates a pending account, then sends a verification link and OTP to the registered email
- **Verification flow:** `POST /api/auth/verify-email` or the emailed link/code must be completed before login is accepted
- **Login flow:** `POST /api/auth/login` returns a signed JWT valid for 15 minutes (configurable via `JWT_ACCESS_EXPIRES_IN`) after the email is verified
- **Password updates:** `PATCH /api/auth/password` verifies the current password before updating
- **Token storage:** Browser `localStorage` under the key `qh_token` (and optionally set in the `qh_token` cookie)
- **Protected API routes:** Include the token in every request as `Authorization: Bearer <token>`
- **Protected page routes:** Next.js Edge Middleware (`src/middleware.ts`) checks for the token in the `qh_token` cookie or the `Authorization` header before the page renders; unauthenticated requests are redirected to `/?signin=required`
- **Role enforcement:** The employer dashboard uses `requireRole(["employer", "admin"])`, while the job-seeker dashboard uses `requireRole(["jobseeker", "admin"])`
- **Password hashing:** bcryptjs with a cost factor of 12
- **Realtime auth:** Socket.io expects the JWT in the handshake auth or query token

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

Realtime messaging uses Socket.io, which requires a long-running server. If you deploy the API as serverless, host the Socket.io server on a websocket-capable platform.

### Frontend (Vercel)

Deploy the root directory as a standard Next.js project on Vercel. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
