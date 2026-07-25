# PRD — AI Goal Engine

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 2 (CRUD) → 3 (AI)
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

The Goal Engine lets users define goals, break them into sub-goals, and track progress. It connects daily tasks to bigger ambitions. In Phase 3, the AI breaks goals into actionable steps and tracks progress intelligently.

---

## 2. Business Objective

- Help users define and pursue meaningful goals.
- Connect everyday tasks to long-term direction.
- Give the AI Coach the context of what the user is working toward.

---

## 3. User Stories

- As a user, I can create a goal with a target date.
- As a user, I can break a goal into sub-goals.
- As a user, I can link tasks to a goal.
- As a user, I can see my progress toward a goal.
- As a user, I can ask the AI to break a goal into steps.

---

## 4. UX Flow

1. User creates a goal (title, description, target date).
2. User adds sub-goals, or asks AI to generate them.
3. Tasks get linked to the goal.
4. Progress updates as sub-goals and tasks complete.
5. The goal page shows a clear progress view.

---

## 5. UI Requirements

- Goal list with progress bars.
- Goal detail: sub-goals, linked tasks, progress.
- 'Break down with AI' button.
- Create/edit goal form.
- Empty state: 'No goals yet — what are you working toward?'

---

## 6. AI Behavior

The AI takes a goal and proposes a structured breakdown: milestones, sub-goals, and suggested first tasks. It can also assess progress and suggest the next best action toward the goal.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Uses `Goal` and `SubGoal` models. Tasks link via `goalId`. Progress is computed from sub-goals/tasks.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /goals | List goals |
| POST | /goals | Create goal |
| GET | /goals/:id | Goal + sub-goals + tasks |
| PATCH | /goals/:id | Update goal |
| DELETE | /goals/:id | Delete goal |
| POST | /goals/:id/breakdown | AI breakdown |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- `title`: required, 1–200 chars.
- `targetDate`: valid future date, optional.
- `progress`: 0–100.
- Sub-goals belong to a goal owned by the user.

---

## 10. Notifications

- Goal deadline approaching.
- Milestone reached (celebration).
- Stalled goal nudge (no progress in a while).

---

## 11. Analytics

Track: goals created, completed, progress velocity, AI breakdown used. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Deleting a goal → unlink its tasks, don't delete them.
- Goal with no sub-goals → progress from linked tasks only.
- Past target date, incomplete → marked overdue, not failed.
- AI breakdown fails → user adds sub-goals manually.

---

## 13. Acceptance Criteria

- [ ] User can CRUD goals and sub-goals.
- [ ] Tasks link to goals; progress computes correctly.
- [ ] AI can break a goal into steps.
- [ ] All states handled and user-scoped.

---

## 14. Future Expansion

- Goal templates.
- Key results / metrics (OKR style).
- Long-term vision boards.

---

## 15. Cross-References

- Tasks → *02-PRD / Task Manager.md*
- AI Coach → *02-PRD / AI Coach.md*
- Database → *03-Architecture / Database.md*
- Analytics → *02-PRD / Life Analytics.md*

---

*End of PRD — AI Goal Engine — v1.0*
