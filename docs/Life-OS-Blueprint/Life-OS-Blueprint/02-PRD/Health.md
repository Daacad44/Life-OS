# PRD — Health Tracker

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 5 (Advanced & Growth)
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

The Health Tracker helps users monitor key health habits — sleep, water, exercise, mood, and weight — in one place. It connects physical wellbeing to the rest of Life OS and gives the AI coach a fuller picture of the person.

---

## 2. Business Objective

- Help users track and improve their physical wellbeing.
- Connect health to habits, goals, and coaching.
- Give the AI health context for better guidance.

---

## 3. User Stories

- As a user, I can log sleep, water, exercise, and mood.
- As a user, I can set health goals.
- As a user, I can see health trends over time.
- As a user, my coach considers my health.

---

## 4. UX Flow

1. User logs health metrics quickly each day.
2. Metrics show as trends and streaks.
3. Health goals tie into the Goal Engine.
4. The coach references health when relevant.

---

## 5. UI Requirements

- Daily health log (sleep, water, exercise, mood, weight).
- Trend charts.
- Health goal cards.
- Empty state to start logging.

---

## 6. AI Behavior

The AI spots health patterns (e.g. low sleep correlating with low productivity) and offers gentle, non-medical suggestions. It never gives medical diagnoses — only supportive lifestyle guidance.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores `HealthLog` (userId, type, value, date). Health goals link to `Goal`.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /health/logs | List logs |
| POST | /health/logs | Add a log |
| GET | /health/trends | Trends |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- Values within sane ranges.
- `type`: from a defined health metric set.
- Sensitive data handled carefully; user-scoped.

---

## 10. Notifications

- Hydration/exercise reminders.
- Sleep consistency nudges.

---

## 11. Analytics

Track: logs per metric, trends, goal progress. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Missing days → gaps shown honestly.
- Outlier values → flagged, not rejected.
- No medical claims ever.

---

## 13. Acceptance Criteria

- [ ] User can log and view health metrics.
- [ ] Trends display over time.
- [ ] Health goals integrate.
- [ ] AI stays supportive and non-medical.

---

## 14. Future Expansion

- Wearable integrations.
- Nutrition tracking.
- Deeper health analytics.

---

## 15. Cross-References

- Habits → *02-PRD / Habit System.md*
- Goals → *02-PRD / Goal Engine.md*
- Security → *03-Architecture / Security.md*

---

*End of PRD — Health Tracker — v1.0*
