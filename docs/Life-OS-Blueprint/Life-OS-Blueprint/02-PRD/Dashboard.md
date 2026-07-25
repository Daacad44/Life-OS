# PRD — Life Dashboard

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 1 (shell) → 2 (data)
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

The Dashboard is the home screen of Life OS. It brings together today's tasks, goal progress, habit streaks, and AI insights into one glanceable view. It's the first thing users see and the hub they return to.

---

## 2. Business Objective

- Give users an instant overview of their life.
- Surface what matters today.
- Be the launchpad into every other feature.

---

## 3. User Stories

- As a user, I can see today's tasks at a glance.
- As a user, I can see my goal progress.
- As a user, I can see my habit streaks.
- As a user, I can see AI insights and suggestions.
- As a user, I can jump to any feature from here.

---

## 4. UX Flow

1. User logs in and lands on the Dashboard.
2. Widgets show today's plan, goals, habits, insights.
3. User acts directly (check a task, check in a habit).
4. User clicks into any feature for detail.

---

## 5. UI Requirements

- Widget grid (responsive).
- Widgets: Today's Tasks, Goal Progress, Habit Streaks, AI Coach insight, Quick Stats.
- Greeting + date.
- Each widget links to its full feature.
- Skeletons while loading.

---

## 6. AI Behavior

The AI surfaces a short daily insight or suggestion on the dashboard — e.g. what to focus on, a nudge, or an encouragement — pulled from the user's data and memory.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

No new tables — the Dashboard aggregates data from Tasks, Goals, Habits, and the AI layer.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /dashboard | Aggregated dashboard data |
| GET | /dashboard/insight | AI daily insight |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- All aggregated data is user-scoped.
- Insight requests are rate-limited.

---

## 10. Notifications

- None directly — the dashboard displays, it doesn't notify.

---

## 11. Analytics

Track: dashboard views, widget interactions, insight engagement. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- New user with no data → onboarding-style empty widgets.
- A feature has no data → that widget shows its empty state.
- AI insight fails → widget hides gracefully.
- Slow data → each widget loads independently.

---

## 13. Acceptance Criteria

- [ ] Dashboard aggregates tasks, goals, habits.
- [ ] Widgets link to their features.
- [ ] AI insight displays (or degrades gracefully).
- [ ] Loads progressively; all states handled.

---

## 14. Future Expansion

- Customizable widget layout.
- More widgets (finance, health) as features ship.
- Time-of-day adaptive content.

---

## 15. Cross-References

- Tasks → *02-PRD / Task Manager.md*
- Goals → *02-PRD / Goal Engine.md*
- Habits → *02-PRD / Habit System.md*
- AI Coach → *02-PRD / AI Coach.md*
- UX → *04-Design / UX.md*

---

*End of PRD — Life Dashboard — v1.0*
