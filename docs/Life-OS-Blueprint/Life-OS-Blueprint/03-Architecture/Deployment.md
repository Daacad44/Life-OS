# Deployment Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Hosting Overview](#2-hosting-overview)
3. [Environments](#3-environments)
4. [Services & Containers](#4-services--containers)
5. [Deployment Flow](#5-deployment-flow)
6. [Environment Variables](#6-environment-variables)
7. [Domains & SSL](#7-domains--ssl)
8. [Backups & Recovery](#8-backups--recovery)
9. [Monitoring & Logging](#9-monitoring--logging)
10. [Cross-References](#10-cross-references)

---

## 1. Purpose

This document defines how Life OS is deployed and operated: the VPS, Coolify orchestration, environments, and the services that run in production. It matches your existing self-hosted setup.

---

## 2. Hosting Overview

- **VPS** — a self-hosted virtual server.
- **Coolify** — the deployment platform managing containers, environments, and secrets.
- Self-hosting keeps costs controlled and gives full ownership of user data — a fit for Life OS's privacy-sensitive nature.

---

## 3. Environments

| Environment | Purpose |
|-------------|---------|
| **Development** | Local machine, hot reload |
| **Staging** (optional) | Pre-release testing on the VPS |
| **Production** | Live app served to users |

Each environment has its own database and its own secrets.

---

## 4. Services & Containers

Coolify runs each part as a managed service:

| Service | Description |
|---------|-------------|
| **Frontend** | React app (built static files, served via web server) |
| **Backend** | Node.js + Express API |
| **PostgreSQL** | Database with pgvector |
| **Redis** | Cache, queue, sessions |
| **Worker** | Background jobs (BullMQ) |

The frontend is built to static assets; the backend and workers run as long-lived Node processes.

---

## 5. Deployment Flow

1. Push to the `main` branch (or trigger a deploy).
2. Coolify detects the change and pulls the latest code.
3. Frontend is built; backend is built and containerized.
4. Prisma migrations run automatically against the production database.
5. New containers start; health checks confirm they are up.
6. Traffic switches to the new version (zero-downtime where possible).

See *05-Development / CI-CD.md* for the automation detail.

---

## 6. Environment Variables

Required in every environment (stored in Coolify, never in code):

```
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
CLAUDE_API_KEY=
FRONTEND_ORIGIN=
S3_ENDPOINT=
S3_ACCESS_KEY=
S3_SECRET_KEY=
NODE_ENV=
```

A typed config module validates these on startup and fails fast if any are missing.

---

## 7. Domains & SSL

- The frontend and API run on their own subdomains (e.g. `app.` and `api.`).
- SSL/TLS certificates are issued and auto-renewed by Coolify (Let's Encrypt).
- HTTPS is enforced everywhere.

---

## 8. Backups & Recovery

- **Automated database backups** on a schedule (daily), encrypted.
- Backups stored off the primary volume (S3-compatible storage).
- A documented restore procedure, tested periodically.
- File storage (uploads) backed up alongside the database.

---

## 9. Monitoring & Logging

- **Uptime monitoring** on the API and frontend.
- **Structured logs** from the backend (no sensitive data logged).
- **Error tracking** for exceptions.
- **Resource monitoring** (CPU, memory, disk) via the VPS/Coolify.
- Alerts on downtime or error spikes.

---

## 10. Cross-References

- Overall system → *03-Architecture / System Architecture.md*
- Security → *03-Architecture / Security.md*
- CI/CD → *05-Development / CI-CD.md*
- Build order → *Life OS Development Roadmap*

---

*End of Deployment Architecture — v1.0*
