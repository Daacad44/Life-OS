# Life OS

An AI-powered personal operating system — see [`docs/Life-OS-Blueprint`](docs/Life-OS-Blueprint/Life-OS-Blueprint/00-README.md) for the full product, architecture, design, and development blueprint.

**Status:** Phase 0 — Project Setup & Foundation.

## Structure

```
apps/
├── web/       React + TypeScript frontend (Vite, Tailwind, shadcn/ui)
└── api/       Node.js + Express + TypeScript backend
packages/
└── shared/    Shared TS types and Zod schemas (used by both apps)
prisma/        Prisma schema and migrations
docs/          Life OS Blueprint (product, architecture, design, dev process)
```

See [`docs/.../05-Development/Folder Structure.md`](docs/Life-OS-Blueprint/Life-OS-Blueprint/05-Development/Folder%20Structure.md) for the full convention.

## Getting started

```bash
npm install                # installs all workspaces
cp .env.example .env       # Prisma CLI env (DATABASE_URL)
cp apps/api/.env.example apps/api/.env   # API runtime env

npm run dev:web            # http://localhost:5173
npm run dev:api            # http://localhost:4000/health
```

Prisma requires a running PostgreSQL instance (with the `pgvector` extension) reachable at `DATABASE_URL` before running:

```bash
npm run prisma:migrate
```

## Scripts

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `npm run dev:web`         | Start the frontend dev server                |
| `npm run dev:api`         | Start the backend dev server                 |
| `npm run build`           | Build both apps                              |
| `npm run lint`            | Lint the whole repo                          |
| `npm run format`          | Format the whole repo with Prettier          |
| `npm run prisma:generate` | Regenerate the Prisma client                 |
| `npm run prisma:migrate`  | Run Prisma migrations against `DATABASE_URL` |

## Build order

Do not build features ad hoc — follow [`docs/.../Life OS Development Roadmap.md`](<docs/Life-OS-Blueprint/Life-OS-Blueprint/Life OS Development Roadmap.md>). One feature at a time, vertical slice (DB → API → UI), data before AI.
