# PRD — Task Manager 2.0

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 2 (Core Productivity) — build first
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

The Task Manager is the backbone of Life OS. Nearly every other feature references tasks. It provides fast, reliable task capture and management: create, organize, prioritize, complete. This is the first feature built and must be rock-solid.

---

## 2. Business Objective

- Give users a frictionless way to capture and manage what they need to do.
- Serve as the data foundation for the Daily Planner, Goals, Calendar, and AI Coach.
- Build the daily habit that brings users back.

---

## 3. User Stories

- As a user, I can quickly add a task so I don't forget it.
- As a user, I can set a due date and priority so I know what matters.
- As a user, I can mark a task done so I track progress.
- As a user, I can edit or delete a task.
- As a user, I can link a task to a goal so my work ladders up.
- As a user, I can filter and sort tasks to focus.

---

## 4. UX Flow

1. User clicks **Quick Add** (or the + on the Tasks page).
2. Types a title, optionally sets due date/priority/goal.
3. Task appears instantly (optimistic update).
4. User checks the task off when done; it animates to complete.
5. User filters by status/priority or sorts by due date.

The flow must feel instant — capture is the most-used action in the app.

---

## 5. UI Requirements

- A **Quick Add** input (global + on the page).
- A **task list** grouped by status or date.
- Each **TaskItem**: checkbox, title, due date, priority badge, goal link.
- Filter bar: status, priority, goal.
- Sort: due date, priority, created.
- Empty state: "No tasks yet — add your first one."
- Loading skeletons; error with retry.

---

## 6. AI Behavior

In Phase 2, the Task Manager is CRUD-only (no AI). In Phase 3, AI adds:

- **Smart parsing:** "call mom tomorrow at 5" → title + due date extracted.
- **Auto-priority suggestions** based on due date and goals.
- **Task breakdown:** turn a big task into sub-steps.

AI runs through the AI Service Layer and only *suggests* — the user confirms.

---

## 7. Database

Uses the `Task` model (see *03-Architecture / Database.md*):

```prisma
model Task {
  id          String     @id @default(uuid())
  userId      String
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  goalId      String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?
}
```

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List (filter/sort/paginate) |
| POST | `/tasks` | Create |
| GET | `/tasks/:id` | Get one |
| PATCH | `/tasks/:id` | Update |
| DELETE | `/tasks/:id` | Delete (soft) |

All scoped to the authenticated user.

---

## 9. Validation Rules

- `title`: required, 1–200 chars.
- `priority`: one of LOW/MEDIUM/HIGH.
- `status`: one of TODO/IN_PROGRESS/DONE.
- `dueDate`: valid date, optional.
- `goalId`: must belong to the same user if provided.

---

## 10. Notifications

- Optional reminder before a task's due time.
- Overdue task reminder.
- (Notifications feature handles delivery; Task Manager triggers them.)

---

## 11. Analytics

Track: task created, completed, deleted, overdue count, completion rate. Feeds Life Analytics.

---

## 12. Edge Cases

- Empty title → rejected.
- Deleting a task linked to a goal → task removed, goal untouched.
- Task with a past due date → allowed, marked overdue.
- Bulk operations → handle gracefully.
- Offline/failed create → optimistic update rolls back on error.

---

## 13. Acceptance Criteria

- [ ] User can create, read, update, delete tasks.
- [ ] Tasks are user-scoped and secure.
- [ ] Filtering, sorting, pagination work.
- [ ] Optimistic UI with rollback on error.
- [ ] Loading/empty/error states handled.
- [ ] Input validated on client and server.

---

## 14. Future Expansion

- Subtasks/checklists.
- Recurring tasks.
- Tags/labels.
- Drag-and-drop reordering.
- AI smart parsing and breakdown (Phase 3).

---

## 15. Cross-References

- Database → *03-Architecture / Database.md*
- API conventions → *03-Architecture / API.md*
- Daily Planner → *02-PRD / Daily Planner.md*
- Goal Engine → *02-PRD / Goal Engine.md*
- AI Coach → *02-PRD / AI Coach.md*

---

*End of PRD — Task Manager 2.0 — v1.0*
