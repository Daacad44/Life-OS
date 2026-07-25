# PRD — Smart Daily Planner

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 2 (Core Productivity)
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

The Daily Planner turns a list of tasks into a focused daily view. It shows the user what to do today, in what order, and helps them plan their day in seconds. In Phase 3 the AI plans the day automatically.

---

## 2. Business Objective

- Give users a single, clear view of their day.
- Reduce the friction of deciding what to do next.
- Become the screen users open every morning (the daily habit).

---

## 3. User Stories

- As a user, I can see all of today's tasks in one place.
- As a user, I can reorder my day by priority or time.
- As a user, I can move a task to another day.
- As a user, I can plan tomorrow the night before.
- As a user, I can let the AI plan my day for me.

---

## 4. UX Flow

1. User opens the Planner and sees today's tasks.
2. Tasks are grouped (morning/afternoon or by priority).
3. User drags to reorder or reschedules with one action.
4. User checks tasks off through the day.
5. Optionally, user taps 'Plan my day' and the AI arranges it.

---

## 5. UI Requirements

- A day view with today's tasks front and center.
- Date switcher (yesterday / today / tomorrow).
- Drag-and-drop reordering.
- 'Plan my day' AI button.
- Quick-add inline.
- Empty state: 'Nothing planned — add a task or let AI plan your day.'

---

## 6. AI Behavior

The AI reads today's tasks, active goals, and habits, then proposes an ordered plan (what to do, in what sequence, roughly when). It explains its reasoning briefly and the user can accept, tweak, or ignore it.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Reuses the `Task` model (via `dueDate`). May add a lightweight `PlannerEntry` or an `order` field for daily ordering. No heavy new schema — the planner is a view over tasks.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /planner/today | Today's plan |
| GET | /planner/:date | Plan for a date |
| PATCH | /planner/reorder | Reorder day |
| POST | /ai/plan-day | AI-generated plan |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- `date`: valid date.
- Reorder payload references only the user's own tasks.
- AI plan requests are rate-limited.

---

## 10. Notifications

- Optional morning 'here's your day' summary.
- Reminders for time-blocked tasks.

---

## 11. Analytics

Track: plan viewed, AI plan used, tasks completed per day, planning streak. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- No tasks for the day → friendly empty state.
- Overdue tasks → surfaced at the top.
- Reschedule to a past date → prevented.
- AI plan fails → fall back to manual ordering.

---

## 13. Acceptance Criteria

- [ ] User sees today's tasks in a clear day view.
- [ ] User can reorder and reschedule.
- [ ] User can move between days.
- [ ] AI can generate a plan the user can accept or edit.
- [ ] All states handled.

---

## 14. Future Expansion

- Time-blocking / calendar integration.
- Energy-based scheduling.
- Auto-rollover of unfinished tasks.

---

## 15. Cross-References

- Tasks → *02-PRD / Task Manager.md*
- Calendar → *02-PRD / Calendar.md*
- AI → *03-Architecture / AI Architecture.md*
- Dashboard → *02-PRD / Dashboard.md*

---

*End of PRD — Smart Daily Planner — v1.0*
