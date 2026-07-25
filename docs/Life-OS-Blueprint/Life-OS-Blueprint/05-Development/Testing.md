# Testing Strategy

**Version:** 1.0
**Part of:** Life OS Blueprint / 05-Development
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Testing Philosophy](#2-testing-philosophy)
3. [Testing Pyramid](#3-testing-pyramid)
4. [Backend Testing](#4-backend-testing)
5. [Frontend Testing](#5-frontend-testing)
6. [AI Testing](#6-ai-testing)
7. [What to Test First](#7-what-to-test-first)
8. [Tooling](#8-tooling)
9. [Cross-References](#9-cross-references)

---

## 1. Purpose

This document defines how Life OS is tested. As a solo founder you can't test everything — so this focuses testing effort where it matters most: the logic that breaks quietly and costs the most.

---

## 2. Testing Philosophy

1. **Test behavior, not implementation.**
2. **Cover the critical paths first** — auth, data integrity, money, AI actions.
3. **Fast tests run often.** Slow, flaky tests get ignored.
4. **A bug fixed = a test added**, so it never returns.
5. **Don't chase 100% coverage** — chase confidence.

---

## 3. Testing Pyramid

```
        /\
       /  \   E2E (few) — critical user journeys
      /----\
     /      \  Integration (some) — API + DB
    /--------\
   /          \ Unit (many) — services, utils, logic
  /------------\
```

Most tests are fast unit tests; fewer, broader tests sit on top.

---

## 4. Backend Testing

- **Unit tests** for services (business logic) and utils.
- **Integration tests** for API endpoints against a test database.
- Validation, auth scoping (userId isolation), and error handling are must-test.
- Use a separate test database; reset state between tests.

---

## 5. Frontend Testing

- **Component tests** for shared/composite components.
- **Hook tests** for data hooks (React Query hooks).
- **E2E tests** (Playwright) for critical journeys: sign up, create task, complete daily loop.
- Test states: loading, empty, error, success.

---

## 6. AI Testing

AI is non-deterministic, so test the *scaffolding*, not the exact words:

- Test that prompts are assembled correctly (right data + memory injected).
- Test that responses are parsed/validated safely.
- Test that AI-triggered actions are validated before applying.
- Test fallbacks: the feature degrades gracefully if the AI fails.

---

## 7. What to Test First

Priority order for a solo founder:

1. **Auth & user isolation** — a leak here is catastrophic.
2. **Core CRUD** — tasks, goals, habits.
3. **Data integrity** — validation, edge cases.
4. **AI action safety** — anything the AI creates or changes.
5. **Critical journeys** — the daily loop end to end.

---

## 8. Tooling

| Layer | Tool |
|-------|------|
| Unit/Integration | Vitest / Jest |
| API testing | Supertest |
| Frontend components | Testing Library |
| E2E | Playwright |
| CI | Runs on every PR |

---

## 9. Cross-References

- Coding standards → *05-Development / Coding Standards.md*
- Git workflow → *05-Development / Git Workflow.md*
- CI/CD → *05-Development / CI-CD.md*
- Security (isolation) → *03-Architecture / Security.md*

---

*End of Testing Strategy — v1.0*
