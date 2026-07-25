# Frontend Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Stack](#2-stack)
3. [Folder Structure](#3-folder-structure)
4. [Routing](#4-routing)
5. [State Management](#5-state-management)
6. [Data Fetching](#6-data-fetching)
7. [Component Strategy](#7-component-strategy)
8. [Forms & Validation](#8-forms--validation)
9. [Authentication on the Client](#9-authentication-on-the-client)
10. [Performance](#10-performance)
11. [Cross-References](#11-cross-references)

---

## 1. Purpose

This document defines how the Life OS frontend is built: a React.js single-page application that consumes the Express REST API. It covers structure, routing, state, and data-fetching conventions so the UI stays consistent as 25 features are added.

---

## 2. Stack

| Concern | Choice |
|---------|--------|
| Framework | React.js + TypeScript |
| Build tool | Vite |
| Routing | React Router |
| Server state | React Query (TanStack Query) |
| Client state | Zustand |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| HTTP | Axios (typed API client) |
| Icons | lucide-react |

---

## 3. Folder Structure

```
src/
├── app/                 # App entry, providers, router
├── pages/               # Route-level pages (one per feature area)
├── features/            # Feature modules (self-contained)
│   ├── tasks/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   ├── goals/
│   └── ...
├── components/          # Shared UI (buttons, modals, layout)
├── hooks/               # Shared hooks
├── lib/                 # API client, utils, constants
├── stores/              # Zustand stores
├── styles/              # Tailwind config, globals
└── types/               # Shared TypeScript types
```

Each feature lives in its own folder under `features/` — its components, hooks, and API calls stay together. This mirrors the PRD-per-feature structure and keeps AI coding assistants focused on one feature at a time.

---

## 4. Routing

- React Router handles all navigation.
- Routes are grouped by feature and wrapped in a protected layout.
- Public routes: `/login`, `/signup`, `/`.
- Protected routes: `/dashboard`, `/tasks`, `/goals`, `/calendar`, etc.
- A `ProtectedRoute` wrapper redirects unauthenticated users to `/login`.

---

## 5. State Management

Two clear categories, never mixed:

- **Server state** (data from the API) → **React Query**. Never copied into Zustand.
- **Client/UI state** (modals open, theme, sidebar, filters) → **Zustand**.

This separation prevents the most common React data bugs.

---

## 6. Data Fetching

- All API calls go through a single typed Axios client in `lib/api`.
- Each feature exposes React Query hooks (e.g. `useTasks`, `useCreateTask`).
- Loading, error, and empty states are handled by every query hook.
- Mutations invalidate the relevant queries to keep the UI fresh.

---

## 7. Component Strategy

- **shadcn/ui** provides base primitives (button, dialog, input, dropdown).
- Shared composite components live in `components/`.
- Feature-specific components live inside that feature's folder.
- Components are small, typed, and presentational where possible; logic lives in hooks.

See *04-Design / Components.md* for the component catalog.

---

## 8. Forms & Validation

- **React Hook Form** manages form state.
- **Zod** defines schemas, shared with the backend where possible.
- Validation errors are displayed inline; the same Zod schema validates before submit.

---

## 9. Authentication on the Client

- On login, the API returns a session (httpOnly cookie preferred).
- The client stores minimal auth state (is-logged-in, user profile) in a Zustand store.
- React Query fetches the current user on app load to confirm the session.
- Expired sessions redirect to login automatically via an Axios interceptor.

---

## 10. Performance

- Route-based code splitting (lazy-loaded pages).
- React Query caching to avoid refetching.
- Memoization for expensive lists.
- Optimistic updates for fast-feeling interactions (tasks, habits).
- Skeleton loaders for perceived speed.

---

## 11. Cross-References

- Overall system → *03-Architecture / System Architecture.md*
- API contract → *03-Architecture / API.md*
- Design system → *04-Design / Design System.md*
- Components → *04-Design / Components.md*
- Folder conventions → *05-Development / Folder Structure.md*

---

*End of Frontend Architecture — v1.0*
