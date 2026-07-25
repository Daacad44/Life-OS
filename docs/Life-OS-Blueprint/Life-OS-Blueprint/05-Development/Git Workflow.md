# Git Workflow

**Version:** 1.0
**Part of:** Life OS Blueprint / 05-Development
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Branching Model](#2-branching-model)
3. [Branch Naming](#3-branch-naming)
4. [Commit Convention](#4-commit-convention)
5. [Pull Requests](#5-pull-requests)
6. [Merging](#6-merging)
7. [Feature = Branch = PRD](#7-feature--branch--prd)
8. [Cross-References](#8-cross-references)

---

## 1. Purpose

This document defines how code moves from idea to production through git. Even as a solo founder, a disciplined git workflow keeps history clean and deploys safe.

---

## 2. Branching Model

A simple, effective model:

| Branch | Role |
|--------|------|
| `main` | Production. Always deployable. |
| `dev` | Integration branch (optional for solo). |
| `feature/*` | One branch per feature or fix. |

Work happens on feature branches, never directly on `main`.

---

## 3. Branch Naming

```
feature/task-manager
feature/ai-coach
fix/login-redirect
chore/setup-eslint
```

Prefix by type, then a short kebab-case description.

---

## 4. Commit Convention

Use **Conventional Commits**:

```
feat: add task creation endpoint
fix: correct habit streak calculation
chore: configure prettier
docs: update database schema
refactor: extract task service
test: add goal service tests
```

Small, focused commits with clear messages.

---

## 5. Pull Requests

- Every feature merges via a PR (even solo — it's a checkpoint).
- A PR should map to one feature/PRD or one fix.
- PR description links the relevant PRD and lists what changed.
- CI (lint, type-check, tests) must pass before merge.

---

## 6. Merging

- **Squash merge** feature branches into `main` for a clean history.
- Delete the branch after merge.
- `main` merging triggers deployment (see *CI-CD.md*).

---

## 7. Feature = Branch = PRD

The core discipline of Life OS development:

```
One PRD  →  one feature branch  →  one PR  →  one merge  →  one deploy
```

This keeps every unit of work small, testable, and traceable — and keeps AI coding assistants focused on exactly one feature at a time.

---

## 8. Cross-References

- Coding standards → *05-Development / Coding Standards.md*
- Testing → *05-Development / Testing.md*
- CI/CD → *05-Development / CI-CD.md*
- Build order → *Life OS Development Roadmap*

---

*End of Git Workflow — v1.0*
