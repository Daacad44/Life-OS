# PRD — AI Reflection

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 3 (AI Engine)
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

AI Reflection guides users through short daily and weekly reflections. It prompts thoughtful questions, captures the answers as memory, and helps users learn from their days — feeding the coach with deeper self-knowledge.

---

## 2. Business Objective

- Help users reflect and grow, not just do.
- Capture rich personal context for the AI.
- Build a meaningful daily/weekly ritual.

---

## 3. User Stories

- As a user, I get a short reflection prompt each day.
- As a user, I can journal how my day went.
- As a user, my reflections inform my coach.
- As a user, I can look back on past reflections.

---

## 4. UX Flow

1. At day's end, the user gets a gentle reflection prompt.
2. User answers 1–3 short questions.
3. The AI responds supportively and stores key insights.
4. Weekly, a deeper reflection reviews the week.

---

## 5. UI Requirements

- A reflection card/prompt.
- A simple journaling input.
- A history of past reflections.
- Empty state inviting the first reflection.

---

## 6. AI Behavior

The AI generates contextual reflection prompts based on the user's day (tasks done, goals, mood), responds with empathy, and extracts durable insights into memory for the coach to use.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores reflections in a `Reflection` model (userId, content, date, type). Key insights also written to `MemoryItem`.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /reflections | List reflections |
| POST | /reflections | Create a reflection |
| GET | /reflections/prompt | AI reflection prompt |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- Content length-limited.
- One primary daily reflection per day (soft rule).
- User-scoped.

---

## 10. Notifications

- Evening reflection reminder.
- Weekly reflection prompt.

---

## 11. Analytics

Track: reflections completed, streak, weekly review completion. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Skipped days → no penalty, gentle re-invite.
- Very short answers → still accepted and valued.
- AI prompt fails → a default prompt is shown.

---

## 13. Acceptance Criteria

- [ ] Daily and weekly reflection prompts work.
- [ ] Reflections are saved and reviewable.
- [ ] Insights feed memory.
- [ ] Supportive, safe AI tone.

---

## 14. Future Expansion

- Mood tracking over time.
- Guided reflection templates.
- Sentiment insights in analytics.

---

## 15. Cross-References

- AI Coach → *02-PRD / AI Coach.md*
- AI Memory → *02-PRD / AI Memory.md*
- Weekly Review → *02-PRD / Weekly Review.md*

---

*End of PRD — AI Reflection — v1.0*
