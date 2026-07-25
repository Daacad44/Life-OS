# PRD — Business Workspace

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 5 (Advanced & Growth)
**Status:** Ready to build

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objective](#2-business-objective)
3. [User Stories](#3-user-stories)
4. [UX Flow](#4-ux-flow)
5. [UI Requirements](#5-ui-requirements)
6. [AI Behavior](#6-ai-behavior)
7. [Database](#7-database)
8. [API Endpoints](#8-api-endpoints)
9. [Validation Rules](#9-validation-rules)
10. [Notifications](#10-notifications)
11. [Analytics](#11-analytics)
12. [Edge Cases](#12-edge-cases)
13. [Acceptance Criteria](#13-acceptance-criteria)
14. [Future Expansion](#14-future-expansion)
15. [Cross-References](#15-cross-references)

---

## 1. Executive Summary

The Business Workspace is a dedicated space for users running projects or a business — like a founder managing products. It organizes projects, clients, and business tasks separately from personal life, while sharing the same AI and productivity engine.

---

## 2. Business Objective

- Support users who run a business or projects.
- Separate business from personal cleanly.
- Reuse the core engine for a professional context.

---

## 3. User Stories

- As a user, I can manage business projects separately.
- As a user, I can track clients and business tasks.
- As a user, I can see business-specific dashboards.
- As a user, my AI coach understands my business context.

---

## 4. UX Flow

1. User switches into the Business Workspace.
2. They manage projects, clients, and tasks there.
3. Business analytics are separate from personal.
4. The AI advises in a business context.

---

## 5. UI Requirements

- Workspace switcher (personal / business).
- Project boards.
- Client list.
- Business dashboard.

---

## 6. AI Behavior

The AI operates with business context: it helps prioritize projects, plan launches, and advise on business tasks, keeping business memory separate from personal.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores `Project` (userId, name, status), `Client` (userId, name, details), and business-scoped tasks (a `context` field on Task, or a workspace id).

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /business/projects | List projects |
| POST | /business/projects | Create project |
| GET | /business/clients | List clients |
| POST | /business/clients | Add client |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- Required fields present.
- Workspace scoping enforced.
- User-scoped.

---

## 10. Notifications

- Project deadlines.
- Client follow-ups.

---

## 11. Analytics

Track: projects, completion, business task load. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Switching workspaces → context isolated.
- Shared tasks → clearly labeled.
- No business data → onboarding empty state.

---

## 13. Acceptance Criteria

- [ ] Business and personal are cleanly separated.
- [ ] Projects and clients are manageable.
- [ ] AI respects business context.
- [ ] All states handled.

---

## 14. Future Expansion

- Team collaboration.
- Invoicing.
- CRM depth.

---

## 15. Cross-References

- Tasks → *02-PRD / Task Manager.md*
- AI Memory (context) → *02-PRD / AI Memory.md*
- Analytics → *02-PRD / Life Analytics.md*

---

*End of PRD — Business Workspace — v1.0*
