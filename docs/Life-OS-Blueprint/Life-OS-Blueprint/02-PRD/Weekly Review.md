# PRD — AI Weekly Review

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

The AI Weekly Review automatically summarizes the user's week — what they accomplished, how their habits and goals progressed — and helps them plan the week ahead. It's a guided ritual that keeps users on track.

---

## 2. Business Objective

- Help users step back and see the bigger picture weekly.
- Reinforce progress and surface what needs attention.
- Drive planning for the coming week.

---

## 3. User Stories

- As a user, I get a summary of my week.
- As a user, I see how my goals and habits progressed.
- As a user, I'm guided to plan the next week.

---

## 4. UX Flow

1. At week's end, the user opens the Weekly Review.
2. The AI presents a summary: completed tasks, habit consistency, goal progress.
3. It highlights wins and gaps.
4. It helps the user set priorities for next week.

---

## 5. UI Requirements

- A weekly review screen with summary cards.
- Wins, misses, and trends.
- A 'plan next week' section.

---

## 6. AI Behavior

The AI aggregates the week's data and memory, generates an encouraging, honest summary, and proposes next-week priorities. It writes key takeaways to memory.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Reads from Tasks, Goals, Habits, Reflections. May store a `WeeklyReview` record per week.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /reviews/weekly | Current week review |
| POST | /reviews/weekly/generate | Generate review |
| GET | /reviews | Past reviews |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- User-scoped.
- One review per week (regenerable).
- Rate-limited generation.

---

## 10. Notifications

- Weekly review ready (e.g. Sunday evening).

---

## 11. Analytics

Track: reviews generated, viewed, next-week plans created. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Sparse week (little data) → concise, still encouraging.
- Mid-week access → partial/preview review.
- AI failure → show raw stats without narrative.

---

## 13. Acceptance Criteria

- [ ] Weekly review aggregates real data.
- [ ] AI produces a helpful summary + plan.
- [ ] Past reviews are viewable.
- [ ] Degrades gracefully.

---

## 14. Future Expansion

- Monthly and yearly reviews.
- Shareable review cards.
- Trend comparisons across weeks.

---

## 15. Cross-References

- Reflection → *02-PRD / Reflection.md*
- Analytics → *02-PRD / Life Analytics.md*
- AI Coach → *02-PRD / AI Coach.md*

---

*End of PRD — AI Weekly Review — v1.0*
