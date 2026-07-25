# PRD — AI Personal Coach

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

The AI Personal Coach is the flagship feature of Life OS. It reads the user's tasks, goals, habits, and memory, then coaches them: guidance, encouragement, planning, and accountability. It's what turns Life OS from a tool into a companion.

---

## 2. Business Objective

- Give every user a personal coach who remembers them.
- Drive the core differentiation and Pro upgrades.
- Keep users progressing toward their goals.

---

## 3. User Stories

- As a user, I can talk to my coach about my goals and day.
- As a user, my coach remembers past conversations and my context.
- As a user, my coach proactively suggests what to focus on.
- As a user, my coach holds me accountable kindly.

---

## 4. UX Flow

1. User opens the AI Coach panel.
2. Coach greets them with context ('You have 3 tasks and a goal deadline soon').
3. User asks questions or requests help; responses stream in.
4. Coach references memory and real data.
5. Suggestions can be acted on directly (create task, adjust plan).

---

## 5. UI Requirements

- A chat-style coach panel (AIChatPanel).
- Streaming responses.
- Actionable suggestion chips (accept/dismiss).
- Access from the dashboard and a dedicated page.

---

## 6. AI Behavior

The Coach is the primary consumer of the AI Service Layer and Memory Engine. Each response assembles: user data (tasks/goals/habits) + retrieved long-term memory + the conversation, then calls Claude. New durable facts are written back to memory.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Uses `MemoryItem` (with pgvector) for long-term memory. May store a `CoachMessage` history table for conversations.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| POST | /ai/coach | Send a message to the coach |
| GET | /ai/coach/history | Conversation history |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- Messages are length-limited.
- Rate-limited per user.
- Memory strictly user-scoped.

---

## 10. Notifications

- Optional proactive coach nudges (daily check-in).
- Encouragement on milestones.

---

## 11. Analytics

Track: coach messages, suggestions accepted, engagement, retention impact. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- New user, little data → coach onboards and asks questions.
- AI failure → graceful fallback message.
- Sensitive topics → coach stays supportive and safe.
- Long history → summarized into memory, not re-sent whole.

---

## 13. Acceptance Criteria

- [ ] Coach responds using real user data + memory.
- [ ] Responses stream; suggestions are actionable.
- [ ] New memories are stored and reused.
- [ ] User-scoped, rate-limited, safe.

---

## 14. Future Expansion

- Voice coaching.
- Proactive daily coaching routines.
- Specialized coaching modes (career, health).

---

## 15. Cross-References

- AI architecture → *03-Architecture / AI Architecture.md*
- AI Memory → *02-PRD / AI Memory.md*
- Goals → *02-PRD / Goal Engine.md*
- Reflection → *02-PRD / Reflection.md*

---

*End of PRD — AI Personal Coach — v1.0*
