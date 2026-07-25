# System Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Architecture Overview](#2-architecture-overview)
3. [System Diagram](#3-system-diagram)
4. [Core Components](#4-core-components)
5. [Request Lifecycle](#5-request-lifecycle)
6. [Data Flow](#6-data-flow)
7. [AI Subsystem](#7-ai-subsystem)
8. [Scalability Strategy](#8-scalability-strategy)
9. [Cross-References](#9-cross-references)

---

## 1. Purpose

This document describes the overall system architecture of Life OS — how the frontend, backend, database, AI engine, and supporting services fit together. It is the top-level technical map; all other architecture documents (Frontend, Backend, Database, AI, Security, API, Deployment) expand on the pieces defined here.

---

## 2. Architecture Overview

Life OS uses a **decoupled client-server architecture**:

- A **React.js single-page application** (the client) runs in the browser.
- A **Node.js + Express REST API** (the server) handles all business logic.
- A **PostgreSQL database** (with the pgvector extension) stores all data and AI memory.
- The **Claude API** provides all AI intelligence, wrapped behind an internal AI service layer.
- **Redis** handles caching, sessions, rate limiting, and background job queues.
- Everything is **self-hosted on a VPS, orchestrated by Coolify**.

The frontend and backend are fully separated. They communicate only over HTTP(S) through a versioned REST API. This separation means either side can be developed, deployed, or scaled independently.

---

## 3. System Diagram

```
                        ┌─────────────────────────┐
                        │        Browser          │
                        │   React.js SPA (client) │
                        └───────────┬─────────────┘
                                    │ HTTPS / REST (JSON)
                                    ▼
                        ┌─────────────────────────┐
                        │   Node.js + Express API │
                        │   (Business Logic Layer)│
                        └───┬─────────┬────────┬──┘
                            │         │        │
                 ┌──────────▼──┐ ┌────▼────┐ ┌─▼──────────────┐
                 │ PostgreSQL  │ │  Redis  │ │  AI Service    │
                 │ + pgvector  │ │ (cache/ │ │  Layer         │
                 │ (Prisma)    │ │  queue) │ │  → Claude API  │
                 └─────────────┘ └─────────┘ └────────────────┘
                            │
                 ┌──────────▼──────────┐
                 │  S3-compatible      │
                 │  file storage       │
                 └─────────────────────┘

        All services run on a VPS, orchestrated by Coolify.
```

---

## 4. Core Components

| Component | Responsibility |
|-----------|----------------|
| **React Client** | UI rendering, routing, local state, API calls |
| **Express API** | Authentication, business logic, validation, orchestration |
| **Prisma ORM** | Type-safe database access and migrations |
| **PostgreSQL** | Primary data store (users, tasks, goals, habits, etc.) |
| **pgvector** | Vector embeddings for AI memory and semantic search |
| **Redis** | Sessions, caching, rate limiting, background job queue |
| **AI Service Layer** | Wraps the Claude API: prompts, memory, tokens, retries |
| **File Storage** | User uploads, attachments, exports |
| **Coolify** | Deployment, containers, environment management |

---

## 5. Request Lifecycle

A typical authenticated request flows as follows:

1. The React client sends an HTTPS request with a session token.
2. Express middleware authenticates and authorizes the request.
3. Input is validated (request schema).
4. The controller calls the relevant service (business logic).
5. The service reads/writes data via Prisma, and/or calls the AI service layer.
6. Redis is checked/updated for cached or rate-limited data.
7. A structured JSON response is returned to the client.
8. The client updates its UI via React Query.

---

## 6. Data Flow

- **Reads:** Client → API → (Redis cache → if miss →) PostgreSQL → API → Client.
- **Writes:** Client → API → validation → PostgreSQL → cache invalidation → Client.
- **AI operations:** Client → API → AI Service Layer → (memory lookup via pgvector) → Claude API → response processed → stored/returned.

---

## 7. AI Subsystem

The AI is never called directly from the frontend. All AI requests pass through the **AI Service Layer** on the backend, which:

- Builds prompts from templates.
- Retrieves relevant memory from pgvector.
- Enforces rate limits and tracks token usage.
- Handles retries and error fallbacks.
- Stores new memories and results.

This keeps AI logic centralized, secure, and swappable. See *AI Architecture.md* for full detail.

---

## 8. Scalability Strategy

Life OS starts as a modular monolith (one Express API) — the right choice for a solo founder. It is designed so that, if needed later, heavy parts can be extracted:

- **Stateless API:** the Express server holds no session state (sessions live in Redis), so it can be horizontally scaled behind a load balancer.
- **Background jobs:** long AI tasks run through a Redis-backed queue, not in the request cycle.
- **Database:** read replicas can be added later; pgvector scales with the database.
- **Caching:** Redis absorbs repeated reads to protect PostgreSQL.

The system avoids premature microservices. Modularity is enforced in code structure, not infrastructure.

---

## 9. Cross-References

- Frontend detail → *03-Architecture / Frontend.md*
- Backend detail → *03-Architecture / Backend.md*
- Data model → *03-Architecture / Database.md*
- AI internals → *03-Architecture / AI Architecture.md*
- Security model → *03-Architecture / Security.md*
- API contract → *03-Architecture / API.md*
- Hosting → *03-Architecture / Deployment.md*
- Build order → *Life OS Development Roadmap*

---

*End of System Architecture — v1.0*
