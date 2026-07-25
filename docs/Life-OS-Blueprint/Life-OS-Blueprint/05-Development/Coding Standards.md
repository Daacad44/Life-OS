# Coding Standards

**Version:** 1.0
**Part of:** Life OS Blueprint / 05-Development
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [General Principles](#2-general-principles)
3. [TypeScript Rules](#3-typescript-rules)
4. [Naming Conventions](#4-naming-conventions)
5. [Frontend Standards](#5-frontend-standards)
6. [Backend Standards](#6-backend-standards)
7. [Error Handling](#7-error-handling)
8. [Comments & Documentation](#8-comments--documentation)
9. [Tooling](#9-tooling)
10. [Cross-References](#10-cross-references)

---

## 1. Purpose

This document defines how code is written in Life OS. Consistent standards keep the codebase readable, maintainable, and easy for AI coding assistants to extend without introducing drift.

---

## 2. General Principles

1. **Clarity over cleverness.** Readable code beats clever code.
2. **Small units.** Small functions, small components, single responsibility.
3. **Type everything.** No implicit `any`.
4. **DRY, within reason.** Reuse, but don't over-abstract early.
5. **Consistency wins.** Follow the existing pattern over a personal preference.

---

## 3. TypeScript Rules

- `strict` mode is on.
- No `any` — use proper types or `unknown` + narrowing.
- Prefer `type`/`interface` for all data shapes.
- Share types between frontend and backend where practical.
- Use enums or union types for fixed sets.

---

## 4. Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Variables/functions | camelCase | `getUserTasks` |
| Components | PascalCase | `TaskList` |
| Types/Interfaces | PascalCase | `Task`, `CreateTaskInput` |
| Constants | UPPER_SNAKE | `MAX_TASKS` |
| Files (components) | PascalCase | `TaskList.tsx` |
| Files (other) | kebab/camel | `task-service.ts` |
| DB fields | camelCase | `dueDate` |

Names should describe intent, not implementation.

---

## 5. Frontend Standards

- Functional components + hooks only.
- One component per file.
- Logic lives in hooks (`useTasks`), not inside components.
- Server state via React Query; UI state via Zustand.
- No inline hardcoded colors/spacing — use tokens.
- Every list handles loading/empty/error.

---

## 6. Backend Standards

- Follow the layered structure: route → controller → service → repository.
- Controllers hold no business logic.
- Only repositories touch Prisma.
- Every endpoint validates input with Zod.
- Every query is scoped by `userId`.
- Return the standard response envelope.

---

## 7. Error Handling

- Throw typed custom errors (`NotFoundError`, `ValidationError`, etc.).
- A central error handler formats all responses.
- Never leak stack traces to clients.
- Never swallow errors silently — log them.

---

## 8. Comments & Documentation

- Code should be self-explanatory; comment the *why*, not the *what*.
- Public functions/services get a short doc comment.
- Each feature keeps its PRD as its source of truth.
- Update docs when behavior changes.

---

## 9. Tooling

- **ESLint** — enforce rules automatically.
- **Prettier** — consistent formatting.
- **Husky** — pre-commit hooks (lint + format + type-check).
- **TypeScript** — the type checker is part of CI.

Code that fails lint or type-check does not merge.

---

## 10. Cross-References

- Folder structure → *05-Development / Folder Structure.md*
- Git workflow → *05-Development / Git Workflow.md*
- Testing → *05-Development / Testing.md*
- Backend architecture → *03-Architecture / Backend.md*
- Frontend architecture → *03-Architecture / Frontend.md*

---

*End of Coding Standards — v1.0*
