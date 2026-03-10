# DailyRoutine

DailyRoutine is a production-style full-stack daily work planner built with Next.js, TypeScript, Prisma, JWT cookie auth, Tailwind CSS, and Recharts. It supports secure authentication, user-scoped task CRUD, a separate daily checklist page, auto-missed task handling, responsive task management, and weekly/monthly/yearly analytics.

## 1. Final stack

- Frontend: Next.js App Router + React 19 + TypeScript + Tailwind CSS
- Backend: Next.js Route Handlers for REST-style APIs
- Database: SQLite for local development with Prisma ORM
- Auth: JWT stored in secure HTTP-only cookies + bcrypt password hashing
- Charts: Recharts

### Why this stack

- A single Next.js codebase keeps UI, API routes, auth, and server rendering tightly aligned.
- Prisma adds a clear schema, migrations, and type-safe data access that scales better than handwritten SQL for this app size.
- SQLite removes local setup friction for development, while Prisma keeps the schema portable if you later move to PostgreSQL.
- JWT cookies provide stateless auth while keeping tokens out of local storage.

## 2. Folder structure

```text
DailyRoutine/
|-- prisma/
|   |-- schema.prisma
|-- public/
|-- src/
|   |-- app/
|   |   |-- (auth)/
|   |   |-- (dashboard)/
|   |   |-- api/
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- components/
|   |-- lib/
|   `-- types/
|-- middleware.ts
|-- package.json
`-- .env.example
```

## 3. Backend

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`
- `GET /api/analytics`

Key behavior:

- Every protected query is scoped to the authenticated user.
- Passwords are hashed with `bcryptjs`.
- Missed tasks are auto-updated on task and analytics reads.
- Validation is handled with Zod before writes.

## 4. Frontend

- Mobile-first auth screens
- Protected dashboard with KPI cards
- Recharts-based weekly, monthly, and yearly analytics
- Separate add/manage page and daily checklist page
- Responsive task list with filters, create/edit dialog, and delete actions
- Checklist page for ticking and unticking today’s work
- Daily recurring tasks that reset to pending each new day
- Empty states and inline validation

## 5. Database schema

### User

- `id`
- `name`
- `email`
- `passwordHash`
- timestamps

### Task

- `id`
- `title`
- `description`
- `date`
- `startTime`
- `endTime`
- `status`
- `completedAt`
- `userId`
- timestamps

## 6. Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env vars:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` with your JWT secret. The default SQLite database path works locally.

4. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start the app:

```bash
npm run dev
```

6. Open `http://localhost:3000`

## 7. Future improvements

- Add recurring tasks and drag-and-drop scheduling.
- Add timezone-aware timestamp storage.
- Add cron-based missed-task processing instead of request-time sync.
- Add optimistic updates, toast notifications, and pagination.
- Add automated tests for auth, tasks, and analytics.

## Deploy on Render

This repo includes a Render Blueprint in `render.yaml`.

One-click Render setup:

- Create a Blueprint from this repo:
  `https://render.com/deploy?repo=https://github.com/Munalthapa710/dailytrack.git`

What it creates:

- One free Node web service
- One free Render Postgres database

Important Render free limits:

- Free web services spin down after 15 minutes idle
- Free Render Postgres expires after 30 days
