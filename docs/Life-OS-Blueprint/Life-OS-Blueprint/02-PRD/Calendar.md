# PRD — Smart Calendar

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

The Calendar gives users a time-based view of their life: events, scheduled tasks, and deadlines. It connects tasks and goals to actual time, making plans concrete.

---

## 2. Business Objective

- Give users a clear view of their time.
- Connect tasks and deadlines to specific times.
- Support planning by day, week, and month.

---

## 3. User Stories

- As a user, I can create events with a start and end time.
- As a user, I can see tasks with due dates on the calendar.
- As a user, I can switch between day/week/month views.
- As a user, I can link an event to a task.

---

## 4. UX Flow

1. User opens the calendar (default: week view).
2. User creates an event by clicking a time slot.
3. Tasks with due dates appear on their day.
4. User switches views and navigates dates.

---

## 5. UI Requirements

- Day / week / month toggle.
- Event creation modal.
- Events and task-deadlines visually distinct.
- Today clearly highlighted.
- Empty state for a free day.

---

## 6. AI Behavior

In later phases, the AI suggests where to place tasks in open time slots and detects scheduling conflicts. It can auto-schedule a plan into the calendar.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Uses the `CalendarEvent` model, optionally linked to a `Task` via `taskId`.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /events | List events (date range) |
| POST | /events | Create event |
| GET | /events/:id | Get event |
| PATCH | /events/:id | Update event |
| DELETE | /events/:id | Delete event |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- `title`: required.
- `startTime` < `endTime`.
- Date range queries are bounded.
- `taskId` must belong to the user if provided.

---

## 10. Notifications

- Event reminders before start.
- Daily agenda summary.

---

## 11. Analytics

Track: events created, calendar views, task-to-event links. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Overlapping events → allowed but flagged.
- All-day events → supported.
- Timezone handling → store UTC, display local.
- Deleting a linked task → event remains.

---

## 13. Acceptance Criteria

- [ ] User can CRUD events.
- [ ] Day/week/month views work.
- [ ] Task deadlines appear correctly.
- [ ] Timezones handled properly.

---

## 14. Future Expansion

- External calendar sync (Google Calendar).
- Recurring events.
- AI auto-scheduling.

---

## 15. Cross-References

- Tasks → *02-PRD / Task Manager.md*
- Daily Planner → *02-PRD / Daily Planner.md*
- Database → *03-Architecture / Database.md*

---

*End of PRD — Smart Calendar — v1.0*
