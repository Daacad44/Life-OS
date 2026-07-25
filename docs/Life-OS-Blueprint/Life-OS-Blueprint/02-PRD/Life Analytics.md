# PRD — Life Analytics

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

Life Analytics turns the user's accumulated data into insight: trends across tasks, habits, goals, focus, and finance. It shows patterns over time and helps users understand how they actually spend their life.

---

## 2. Business Objective

- Turn tracked data into meaningful insight.
- Help users see patterns and improve.
- Reinforce progress with visible trends.

---

## 3. User Stories

- As a user, I can see my productivity trends over time.
- As a user, I can see habit consistency and goal velocity.
- As a user, I can understand where my time and effort go.

---

## 4. UX Flow

1. User opens the Analytics page.
2. Charts show trends: task completion, habit streaks, goal progress, focus time.
3. The AI highlights notable patterns and suggestions.

---

## 5. UI Requirements

- Dashboard of charts (completion rate, streaks, focus, spending).
- Time-range selector (week/month/year).
- AI insight callouts.

---

## 6. AI Behavior

The AI interprets the analytics: it identifies trends ('you focus best in the morning'), correlations, and actionable suggestions, surfaced in plain language.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Aggregates across all feature tables. May maintain summary/rollup tables for performance.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /analytics/overview | Aggregated metrics |
| GET | /analytics/insights | AI insights |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- User-scoped.
- Range parameters bounded.

---

## 10. Notifications

- Monthly insight summary.

---

## 11. Analytics

Track: (This feature IS analytics.) Track which insights users engage with. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Not enough data → show a 'keep going' message.
- Heavy aggregation → precompute via background jobs.
- Empty ranges → clear empty charts.

---

## 13. Acceptance Criteria

- [ ] Charts show real cross-feature trends.
- [ ] Time ranges work.
- [ ] AI insights are relevant and clear.
- [ ] Performant on large data.

---

## 14. Future Expansion

- Predictive insights.
- Goal forecasting.
- Exportable reports.

---

## 15. Cross-References

- All tracked features → *02-PRD/*
- AI architecture → *03-Architecture / AI Architecture.md*
- Dashboard → *02-PRD / Dashboard.md*

---

*End of PRD — Life Analytics — v1.0*
