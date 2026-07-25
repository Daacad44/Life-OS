# CI/CD

**Version:** 1.0
**Part of:** Life OS Blueprint / 05-Development
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Pipeline Overview](#2-pipeline-overview)
3. [Continuous Integration](#3-continuous-integration)
4. [Continuous Deployment](#4-continuous-deployment)
5. [Database Migrations](#5-database-migrations)
6. [Rollback](#6-rollback)
7. [Environments](#7-environments)
8. [Cross-References](#8-cross-references)

---

## 1. Purpose

This document defines how code goes from a merge to a live deploy automatically and safely, using GitHub (CI) and Coolify (CD) on your VPS.

---

## 2. Pipeline Overview

```
Push / PR → CI checks → merge to main → Coolify deploy → migrations → live
```

Nothing reaches production without passing CI first.

---

## 3. Continuous Integration

Runs on every pull request:

1. **Install** dependencies.
2. **Lint** (ESLint).
3. **Format check** (Prettier).
4. **Type-check** (TypeScript).
5. **Test** (unit + integration).
6. **Build** (frontend + backend) to catch build errors.

If any step fails, the PR cannot merge.

---

## 4. Continuous Deployment

On merge to `main`:

1. Coolify detects the change.
2. Pulls the latest code.
3. Builds the frontend (static assets) and backend (Node service).
4. Runs database migrations.
5. Starts new containers, runs health checks.
6. Switches traffic to the new version (zero-downtime where possible).

---

## 5. Database Migrations

- Migrations run automatically during deploy via **Prisma Migrate**.
- Migrations are committed with the feature that needs them.
- Migrations are **forward-only and safe** — no destructive changes without care.
- Test migrations on staging (or locally) before they hit production.

---

## 6. Rollback

- Keep the previous container/version available to roll back quickly.
- Database rollbacks are handled carefully — prefer forward fixes over reverting schema.
- Backups (see *Deployment.md*) are the safety net for data issues.

---

## 7. Environments

| Environment | Trigger | Purpose |
|-------------|---------|---------|
| Development | Local | Build & test |
| Staging (optional) | `dev` branch | Pre-release checks |
| Production | `main` branch | Live users |

Each has its own database and secrets.

---

## 8. Cross-References

- Deployment → *03-Architecture / Deployment.md*
- Git workflow → *05-Development / Git Workflow.md*
- Testing → *05-Development / Testing.md*
- Coding standards → *05-Development / Coding Standards.md*

---

*End of CI/CD — v1.0*
