# PRD — AI Habit System

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 2 (tracking) → 3 (AI)
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

The Habit System helps users build and maintain habits through streaks and check-ins. In Phase 3, the AI detects patterns, predicts slips, and nudges the user to stay consistent.

---

## 2. Business Objective

- Help users build lasting habits.
- Provide motivating streaks and check-ins.
- Give the AI behavioral data to coach with.

---

## 3. User Stories

- As a user, I can create a habit (daily or weekly).
- As a user, I can check in each day.
- As a user, I can see my streak.
- As a user, I get nudged when I'm about to break a streak.

---

## 4. UX Flow

1. User creates a habit and sets its frequency.
2. Each day, the user checks in with one tap.
3. Streak grows with consistency.
4. The user sees a clear habit dashboard.

---

## 5. UI Requirements

- Habit list with streak badges.
- One-tap check-in button.
- Streak visualization (calendar/heatmap).
- Create/edit habit form.
- Empty state: 'Start your first habit.'

---

## 6. AI Behavior

The AI analyzes check-in patterns to detect when a habit is at risk, sends timely nudges, and celebrates milestones. It can suggest realistic habits based on the user's goals.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Uses `Habit` and `HabitCheckin` models. Streak is derived from check-ins.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /habits | List habits |
| POST | /habits | Create habit |
| POST | /habits/:id/checkin | Check in |
| PATCH | /habits/:id | Update habit |
| DELETE | /habits/:id | Delete habit |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- `title`: required.
- `frequency`: DAILY or WEEKLY.
- One check-in per period (no duplicates).

---

## 10. Notifications

- Daily habit reminder.
- Streak-at-risk nudge.
- Milestone celebration (7/30/100 days).

---

## 11. Analytics

Track: habits created, check-in rate, longest streak, completion trends. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Missed day → streak resets per rules.
- Duplicate check-in → prevented.
- Timezone → check-in day based on user's timezone.
- Deleting a habit → check-ins removed with it.

---

## 13. Acceptance Criteria

- [ ] User can CRUD habits and check in.
- [ ] Streaks calculate correctly across timezones.
- [ ] AI nudges work (Phase 3).
- [ ] All states handled.

---

## 14. Future Expansion

- Habit stacking.
- Flexible schedules (e.g. 3x/week).
- Rewards / gamification integration.

---

## 15. Cross-References

- AI Coach → *02-PRD / AI Coach.md*
- Gamification → *02-PRD / Gamification.md*
- Database → *03-Architecture / Database.md*

---

*End of PRD — AI Habit System — v1.0*
