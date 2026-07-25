# PRD — Focus Mode

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 4 (Intelligence)
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

Focus Mode gives users distraction-free deep-work sessions. It pairs a timer (Pomodoro-style) with a single chosen task, hides everything else, and tracks focused time.

---

## 2. Business Objective

- Help users do deep, focused work.
- Turn intention into concentrated action.
- Generate focus data for analytics.

---

## 3. User Stories

- As a user, I can start a focus session on one task.
- As a user, distractions are hidden during the session.
- As a user, I can use a timer with breaks.
- As a user, I can see how much focused time I logged.

---

## 4. UX Flow

1. User picks a task and starts Focus Mode.
2. A clean, minimal timer view takes over.
3. Work/break intervals run (e.g. 25/5).
4. On completion, focused time is logged to the task.

---

## 5. UI Requirements

- Full-screen minimal focus view.
- Timer with start/pause/stop.
- The active task displayed.
- Session summary at the end.

---

## 6. AI Behavior

Optionally, the AI suggests what to focus on next based on priorities, and reflects on focus patterns (best times of day) over time.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores `FocusSession` (userId, taskId, duration, startedAt, endedAt).

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| POST | /focus/start | Start a session |
| POST | /focus/end | End a session |
| GET | /focus/sessions | List sessions |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- A session references a valid user-owned task (optional task).
- Duration is bounded.

---

## 10. Notifications

- Break start/end chimes.
- Session complete.

---

## 11. Analytics

Track: sessions, total focus time, focus by day/time, task focus. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- User leaves mid-session → session saved as partial.
- No task selected → free focus session allowed.
- Timer running across refresh → state restored.

---

## 13. Acceptance Criteria

- [ ] User can run a focus session with a timer.
- [ ] Distraction-free UI.
- [ ] Focused time logged and viewable.
- [ ] All states handled.

---

## 14. Future Expansion

- Ambient sounds.
- Website/app blocking integrations.
- Focus goals and streaks.

---

## 15. Cross-References

- Tasks → *02-PRD / Task Manager.md*
- Analytics → *02-PRD / Life Analytics.md*
- UX → *04-Design / UX.md*

---

*End of PRD — Focus Mode — v1.0*
