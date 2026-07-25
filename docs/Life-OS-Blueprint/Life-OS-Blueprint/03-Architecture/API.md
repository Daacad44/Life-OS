# API Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [API Style & Conventions](#2-api-style--conventions)
3. [Base URL & Versioning](#3-base-url--versioning)
4. [Response Envelope](#4-response-envelope)
5. [Error Format](#5-error-format)
6. [Authentication](#6-authentication)
7. [Pagination, Filtering, Sorting](#7-pagination-filtering-sorting)
8. [Core Endpoints (Foundation)](#8-core-endpoints-foundation)
9. [Status Codes](#9-status-codes)
10. [Cross-References](#10-cross-references)

---

## 1. Purpose

This document defines the API contract for Life OS: conventions every endpoint follows, the shared response and error shapes, and the foundational endpoints. Each feature PRD defines its own endpoints following these rules.

---

## 2. API Style & Conventions

- **RESTful JSON** over HTTPS.
- Resource-based URLs, plural nouns: `/tasks`, `/goals`, `/habits`.
- Standard HTTP verbs: `GET`, `POST`, `PATCH`, `DELETE`.
- camelCase JSON keys.
- Every request validated with Zod.
- Every response uses the same envelope.

---

## 3. Base URL & Versioning

```
https://api.lifeos.app/v1
```

- The API is versioned in the path (`/v1`).
- Breaking changes go to a new version; existing clients keep working.

---

## 4. Response Envelope

Every successful response uses a consistent shape:

```json
{
  "success": true,
  "data": { }
}
```

For lists:

```json
{
  "success": true,
  "data": [ ],
  "meta": { "page": 1, "pageSize": 20, "total": 135 }
}
```

---

## 5. Error Format

Every error uses the same shape:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": []
  }
}
```

Common codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`, `INTERNAL_ERROR`.

---

## 6. Authentication

- Auth via httpOnly session cookie (or `Authorization: Bearer <token>`).
- Unauthenticated requests to protected routes return `401`.
- Requests for resources the user doesn't own return `404`.

---

## 7. Pagination, Filtering, Sorting

- **Pagination:** `?page=1&pageSize=20`.
- **Filtering:** `?status=TODO&priority=HIGH`.
- **Sorting:** `?sort=dueDate&order=asc`.
- **Search:** `?q=keyword`.

Defaults are sensible (page 1, pageSize 20) so clients can omit them.

---

## 8. Core Endpoints (Foundation)

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Log in |
| POST | `/auth/logout` | Log out |
| GET | `/auth/me` | Current user |

### Account (Data Rights)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me/export` | Export all of the user's data as JSON |
| DELETE | `/users/me` | Hard-delete the account and all owned data (requires re-authentication) |

See *03-Architecture / Security.md*, Section 9 (Data Rights & Compliance).

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get one task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/goals` | List goals |
| POST | `/goals` | Create goal |
| GET | `/goals/:id` | Get goal (+ sub-goals) |
| PATCH | `/goals/:id` | Update goal |
| DELETE | `/goals/:id` | Delete goal |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/habits` | List habits |
| POST | `/habits` | Create habit |
| POST | `/habits/:id/checkin` | Check in for today |
| PATCH | `/habits/:id` | Update habit |
| DELETE | `/habits/:id` | Delete habit |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/coach` | Ask the AI coach |
| POST | `/ai/plan-day` | Generate a daily plan |
| POST | `/ai/search` | Semantic search |

Each feature PRD adds its own endpoint table in this same format.

---

## 9. Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No content (delete) |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Forbidden |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Server error |

---

## 10. Cross-References

- Overall system → *03-Architecture / System Architecture.md*
- Backend → *03-Architecture / Backend.md*
- Security → *03-Architecture / Security.md*
- Frontend consumption → *03-Architecture / Frontend.md*
- Per-feature endpoints → *02-PRD / (each feature).md*

---

*End of API Architecture — v1.0*
