# Backend Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Stack](#2-stack)
3. [Layered Architecture](#3-layered-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Request Pipeline](#5-request-pipeline)
6. [Error Handling](#6-error-handling)
7. [Validation](#7-validation)
8. [Background Jobs](#8-background-jobs)
9. [Configuration & Secrets](#9-configuration--secrets)
10. [Cross-References](#10-cross-references)

---

## 1. Purpose

This document defines the Life OS backend: a Node.js + Express REST API written in TypeScript. It handles authentication, business logic, validation, database access, and orchestration of the AI service layer.

---

## 2. Stack

| Concern | Choice |
|---------|--------|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL + pgvector |
| Cache/Queue | Redis + BullMQ |
| Validation | Zod |
| Auth | JWT / session cookies |
| AI | Claude API (via AI Service Layer) |

---

## 3. Layered Architecture

The backend follows a clean, layered structure. A request always flows in one direction:

```
Route → Middleware → Controller → Service → Repository (Prisma) → Database
```

- **Routes** — define endpoints, attach middleware.
- **Middleware** — auth, validation, rate limiting, logging.
- **Controllers** — parse the request, call a service, shape the response. No business logic.
- **Services** — all business logic lives here. Reusable and testable.
- **Repositories** — the only layer that touches Prisma/DB.

This keeps logic out of controllers and database calls out of services — each layer has one job.

---

## 4. Folder Structure

```
src/
├── config/            # Env, constants, clients (db, redis)
├── routes/            # Express routers, grouped by feature
├── middleware/        # Auth, validation, error, rate-limit
├── controllers/       # Request/response handlers
├── services/          # Business logic (per feature)
├── repositories/      # Prisma data access
├── ai/                # AI Service Layer (prompts, memory, Claude client)
├── jobs/              # Background workers (BullMQ)
├── utils/             # Helpers
├── types/             # Shared types
├── validators/        # Zod schemas
└── app.ts             # Express app setup
```

Each feature has a route, controller, service, and repository — mirroring its PRD.

---

## 5. Request Pipeline

1. **Router** matches the endpoint.
2. **Auth middleware** verifies the session/JWT.
3. **Validation middleware** checks the body/params against a Zod schema.
4. **Rate-limit middleware** (Redis) protects the endpoint.
5. **Controller** receives clean, validated input.
6. **Service** executes business logic.
7. **Repository** reads/writes via Prisma.
8. **Controller** returns a consistent JSON envelope.

---

## 6. Error Handling

- A central error-handling middleware catches all errors.
- Custom error classes (`NotFoundError`, `ValidationError`, `AuthError`, etc.).
- Consistent error response shape:

```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Task not found" }
}
```

- Internal errors are logged; clients never see stack traces.

---

## 7. Validation

- Every endpoint validates input with **Zod** before the controller runs.
- Schemas are shared with the frontend where practical.
- Invalid requests are rejected early with a `400` and clear messages.

---

## 8. Background Jobs

Long-running or async work never blocks a request. It is pushed to a **Redis-backed BullMQ queue** and processed by workers:

- AI generation (coaching, weekly reviews, analytics).
- Embedding generation for AI memory.
- Notifications and scheduled reminders.
- Recurring tasks (daily planner rollover, habit resets).

---

## 9. Configuration & Secrets

- All configuration comes from environment variables.
- Secrets (DB URL, Claude API key, Redis URL, JWT secret) are stored in Coolify's environment manager — never in code.
- A typed config module validates required env vars on startup and fails fast if any are missing.

---

## 10. Cross-References

- Overall system → *03-Architecture / System Architecture.md*
- Data model → *03-Architecture / Database.md*
- API contract → *03-Architecture / API.md*
- AI layer → *03-Architecture / AI Architecture.md*
- Security → *03-Architecture / Security.md*
- Coding standards → *05-Development / Coding Standards.md*

---

*End of Backend Architecture — v1.0*
