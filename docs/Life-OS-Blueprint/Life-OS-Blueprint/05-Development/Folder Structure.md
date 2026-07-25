# Folder Structure

**Version:** 1.0
**Part of:** Life OS Blueprint / 05-Development
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Repository Layout](#2-repository-layout)
3. [Frontend Structure](#3-frontend-structure)
4. [Backend Structure](#4-backend-structure)
5. [Shared Code](#5-shared-code)
6. [Feature-First Rule](#6-feature-first-rule)
7. [Cross-References](#7-cross-references)

---

## 1. Purpose

This document defines where code lives. A predictable structure lets anyone — including AI coding assistants — find and add code without guesswork.

---

## 2. Repository Layout

Life OS uses a monorepo with a clear split between frontend and backend:

```
life-os/
├── apps/
│   ├── web/            # React frontend
│   └── api/            # Node.js + Express backend
├── packages/
│   └── shared/         # Shared types, Zod schemas, constants
├── prisma/             # Prisma schema & migrations
├── docs/               # This blueprint
├── .env.example
├── package.json
└── README.md
```

---

## 3. Frontend Structure

```
apps/web/src/
├── app/                # Entry, providers, router
├── pages/              # Route-level pages
├── features/           # Feature modules
│   └── tasks/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── types.ts
├── components/         # Shared UI
├── hooks/              # Shared hooks
├── lib/                # API client, utils
├── stores/             # Zustand stores
├── styles/             # Tailwind, globals
└── types/              # Shared FE types
```

---

## 4. Backend Structure

```
apps/api/src/
├── config/             # Env, clients (db, redis)
├── routes/             # Express routers (per feature)
├── middleware/         # Auth, validation, errors
├── controllers/        # Request/response handlers
├── services/           # Business logic (per feature)
├── repositories/       # Prisma data access
├── ai/                 # AI Service Layer
├── jobs/               # Background workers
├── validators/         # Zod schemas
├── utils/              # Helpers
├── types/              # Shared BE types
└── app.ts              # Express setup
```

---

## 5. Shared Code

`packages/shared/` holds code used by both apps:

- Shared TypeScript types (e.g. `Task`, `Goal`).
- Zod schemas (validate the same way on both sides).
- Shared constants and enums.

This avoids duplicating types between frontend and backend.

---

## 6. Feature-First Rule

Both frontend and backend organize code **by feature**, not by file type:

- Frontend: everything for a feature lives in `features/<feature>/`.
- Backend: a feature has its route, controller, service, and repository.

This mirrors the one-PRD-per-feature structure and keeps AI assistants focused on a single feature at a time.

---

## 7. Cross-References

- Coding standards → *05-Development / Coding Standards.md*
- Frontend architecture → *03-Architecture / Frontend.md*
- Backend architecture → *03-Architecture / Backend.md*
- Database → *03-Architecture / Database.md*

---

*End of Folder Structure — v1.0*
