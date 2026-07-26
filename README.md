# Life OS

An AI-powered personal operating system — see [`docs/Life-OS-Blueprint`](docs/Life-OS-Blueprint/Life-OS-Blueprint/00-README.md) for the full product, architecture, design, and development blueprint.

**Status:** Phase 1 — Core Skeleton (auth, app shell, settings, dashboard container).

## Structure

```
frontend/            React + TypeScript (Vite, Tailwind, shadcn/ui)
backend/              Node.js + Express + TypeScript API
packages/
└── shared/          Types and Zod schemas shared by frontend and backend
prisma/               Database schema and migrations
docs/                  Life OS Blueprint (product, architecture, design, dev process)
Dockerfile.frontend
Dockerfile.backend
docker-compose.yml     Local dev stack (frontend + backend + Postgres + Redis)
```

Three independent top-level projects sharing one repo — each also runs as its own Coolify service in production (frontend, backend, and a separate PostgreSQL database). See [`docs/.../05-Development/Folder Structure.md`](docs/Life-OS-Blueprint/Life-OS-Blueprint/05-Development/Folder%20Structure.md) for the full convention.

## Getting started

```bash
npm install                            # installs all workspaces
cp .env.example .env                   # Prisma CLI env (DATABASE_URL)
cp backend/.env.example backend/.env   # backend runtime env
cp frontend/.env.example frontend/.env # frontend runtime env

npm run dev:frontend    # http://localhost:5173
npm run dev:backend     # http://localhost:4000/health
```

Prisma requires a running PostgreSQL instance (with the `pgvector` extension) reachable at `DATABASE_URL` before running:

```bash
npm run prisma:migrate
```

## Scripts

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `npm run dev:frontend`    | Start the frontend dev server                |
| `npm run dev:backend`     | Start the backend dev server                 |
| `npm run build`           | Build both apps                              |
| `npm run lint`            | Lint the whole repo                          |
| `npm run format`          | Format the whole repo with Prettier          |
| `npm run prisma:generate` | Regenerate the Prisma client                 |
| `npm run prisma:migrate`  | Run Prisma migrations against `DATABASE_URL` |

## Deployment

`Dockerfile.frontend` and `Dockerfile.backend` (repo root) each build one image, independently deployable as separate Coolify resources. Both need the **repo root as build context** (Coolify Base Directory `.`) because of npm workspaces — see the comment at the top of each Dockerfile.

### Running the full stack locally with Docker

```bash
docker compose up --build
```

Starts Postgres (with pgvector), Redis, the backend (runs `prisma migrate deploy` on boot), and the frontend — frontend on `:5173`, backend on `:4000`. Useful for testing the whole app end-to-end without depending on the Coolify VPS being reachable. Requires Docker Desktop (or another Docker engine) installed locally.

## Build order

Do not build features ad hoc — follow [`docs/.../Life OS Development Roadmap.md`](<docs/Life-OS-Blueprint/Life-OS-Blueprint/Life OS Development Roadmap.md>). One feature at a time, vertical slice (DB → API → UI), data before AI.
