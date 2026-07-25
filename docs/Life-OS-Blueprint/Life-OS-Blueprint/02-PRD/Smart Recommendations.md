# PRD — Smart Recommendations

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

Smart Recommendations is a proactive intelligence layer that surfaces cross-feature suggestions: what to focus on, habits to build, goals to set, or adjustments to make — all based on the user's data and memory. It makes Life OS feel alive and personal.

---

## 2. Business Objective

- Make Life OS proactive, not just reactive.
- Surface the right suggestion at the right moment.
- Deepen personalization using memory.

---

## 3. User Stories

- As a user, I get proactive suggestions relevant to me.
- As a user, suggestions consider all my data together.
- As a user, I can accept or dismiss suggestions.

---

## 4. UX Flow

1. Recommendations appear contextually (dashboard, coach).
2. Each is specific and actionable.
3. The user accepts (it acts) or dismisses (it learns).

---

## 5. UI Requirements

- Recommendation cards with accept/dismiss.
- A recommendations feed.
- Inline suggestions across features.

---

## 6. AI Behavior

The AI continuously analyzes the user's full context (tasks, goals, habits, patterns, memory) to generate a small number of high-value, personalized recommendations, ranked by impact. It learns from accept/dismiss feedback.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores `Recommendation` (userId, type, content, status). Reads across all features and memory.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /recommendations | List active recommendations |
| POST | /recommendations/:id/accept | Accept |
| POST | /recommendations/:id/dismiss | Dismiss |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- User-scoped.
- Volume-capped to avoid overwhelm.
- Rate-limited generation.

---

## 10. Notifications

- Occasional high-value recommendation.

---

## 11. Analytics

Track: recommendations shown, accepted, dismissed, impact. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Too little data → conservative, few suggestions.
- Repeatedly dismissed type → suppressed.
- AI failure → no recommendations shown (silent).

---

## 13. Acceptance Criteria

- [ ] Relevant, cross-feature recommendations generate.
- [ ] Accept/dismiss works and informs future ones.
- [ ] Volume stays reasonable.
- [ ] User-scoped and safe.

---

## 14. Future Expansion

- Reinforcement from long-term outcomes.
- Context-aware timing.
- Explainable recommendations.

---

## 15. Cross-References

- AI Memory → *02-PRD / AI Memory.md*
- AI Coach → *02-PRD / AI Coach.md*
- Analytics → *02-PRD / Life Analytics.md*

---

*End of PRD — Smart Recommendations — v1.0*
