# Security Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Security Principles](#2-security-principles)
3. [Authentication](#3-authentication)
4. [Authorization](#4-authorization)
5. [Data Protection](#5-data-protection)
6. [Input & API Security](#6-input--api-security)
7. [AI-Specific Security](#7-ai-specific-security)
8. [Infrastructure Security](#8-infrastructure-security)
9. [Data Rights & Compliance](#9-data-rights--compliance)
10. [Security Checklist](#10-security-checklist)
11. [Cross-References](#11-cross-references)

---

## 1. Purpose

This document defines how Life OS protects user data and the system itself. Because Life OS holds deeply personal data (goals, habits, health, finance, reflections), security is a first-class concern, not an afterthought.

---

## 2. Security Principles

1. **Least privilege** — every request gets only the access it needs.
2. **User isolation** — a user can only ever access their own data.
3. **Defense in depth** — multiple layers (auth, validation, rate limits, infra).
4. **Never trust the client** — all rules enforced server-side.
5. **Secrets stay secret** — never in code or the frontend.

---

## 3. Authentication

Life OS uses a **custom auth implementation** — no third-party auth provider (e.g. Clerk) and no Next.js-coupled library (e.g. NextAuth), since the stack is a standalone Express API, not Next.js.

- Passwords hashed with **bcrypt/argon2** — never stored in plain text.
- Sessions via **httpOnly, secure cookies**, session state stored in **Redis** (matches the stateless-API scalability strategy in *System Architecture.md*).
- **Passport.js** is added later, only when Google OAuth (social login) is needed — it plugs into the same Express app without replacing the custom session layer.
- Session expiry and refresh handled server-side.
- Login endpoints are rate-limited to resist brute force.

---

## 4. Authorization

- Every protected endpoint checks the authenticated user.
- Every database query is **scoped to the `userId`** of the requester.
- A user requesting a record they don't own receives a `404`, not the data.
- Roles (e.g. admin) are supported for future team/enterprise use.

---

## 5. Data Protection

- **In transit:** HTTPS/TLS everywhere.
- **At rest:** database-level encryption on the VPS volume.
- **Sensitive fields** (finance, health) are treated with extra care and never logged.
- **Soft deletes** keep user data recoverable; hard deletes on account removal.
- Regular encrypted database backups.

---

## 6. Input & API Security

- All input validated with **Zod** before processing.
- Parameterized queries via Prisma prevent SQL injection.
- **Rate limiting** (Redis) on all endpoints, stricter on auth and AI.
- **CORS** locked to the known frontend origin.
- Security headers (Helmet): CSP, HSTS, no-sniff, frame protection.
- Request size limits to prevent abuse.

---

## 7. AI-Specific Security

- The frontend never holds the Claude API key — all AI runs server-side.
- Memory is strictly user-scoped; one user's data can never enter another's prompt.
- Prompt inputs are structured, not raw concatenation, to reduce prompt injection.
- AI outputs that create/modify data are validated before being applied.
- Token usage is tracked and rate-limited per user.

---

## 8. Infrastructure Security

- Secrets stored in **Coolify's environment manager**, never in git.
- Database and Redis are **not exposed publicly** — only reachable by the API.
- Firewall limits open ports to what's needed (HTTPS).
- Automatic security updates on the VPS.
- Separate environments for development and production.

---

## 9. Data Rights & Compliance

Life OS holds deeply personal data (goals, habits, health, finance, reflections), so users get baseline data-rights controls from Phase 1 — this is built alongside auth, not retrofitted after Phase 3+ features add more sensitive data.

- **Right to export:** `GET /users/me/export` returns all of a user's data (profile, tasks, goals, habits, notes, memories, etc.) as a single JSON document.
- **Right to deletion:** `DELETE /users/me` hard-deletes the user and all owned records (overrides soft-delete), after re-authentication confirmation. Backups age out on the standard backup retention window.
- **Consent:** account creation requires accepting a Privacy Policy and Terms of Service (placeholder documents until legal review before public launch — see *Life OS Development Roadmap*, Phase 6).
- **Third-party processors:** Claude API (Anthropic) processes user content sent in prompts; per Anthropic's API data policy this is not used for model training by default. Document this in the Privacy Policy.
- **Data minimization:** only send the AI Service Layer the structured data and memory needed for the current request (see *AI Architecture.md*) — never the user's full record.
- **Scope:** this is a practical baseline (export, deletion, consent, minimization), not a substitute for formal legal review (GDPR/CCPA applicability) before public launch.

---

## 10. Security Checklist

- [ ] Passwords hashed (argon2/bcrypt)
- [ ] httpOnly secure cookies (Redis-backed sessions)
- [ ] Every query scoped by userId
- [ ] Zod validation on every endpoint
- [ ] Rate limiting on auth + AI
- [ ] CORS restricted to frontend origin
- [ ] Security headers via Helmet
- [ ] Secrets in env, not code
- [ ] DB/Redis not publicly exposed
- [ ] HTTPS enforced
- [ ] Encrypted backups scheduled
- [ ] Data export endpoint (`/users/me/export`) implemented
- [ ] Account deletion endpoint (`/users/me` DELETE, hard delete) implemented
- [ ] Privacy Policy / ToS accepted at signup

---

## 11. Cross-References

- Overall system → *03-Architecture / System Architecture.md*
- Backend → *03-Architecture / Backend.md*
- AI security → *03-Architecture / AI Architecture.md*
- Deployment → *03-Architecture / Deployment.md*
- Data export/deletion endpoints → *03-Architecture / API.md*

---

*End of Security Architecture — v1.0*
