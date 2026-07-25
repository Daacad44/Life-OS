# PRD — Study Planner

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

The Study Planner helps students and lifelong learners organize courses, study sessions, and learning goals. It structures what to learn, schedules study time, and uses AI to plan effective learning.

---

## 2. Business Objective

- Help users learn effectively and consistently.
- Organize subjects, materials, and study sessions.
- Use AI to build smart study plans.

---

## 3. User Stories

- As a user, I can add subjects/courses I'm studying.
- As a user, I can schedule study sessions.
- As a user, I can track what I've learned.
- As a user, I can get an AI-generated study plan.

---

## 4. UX Flow

1. User adds a subject and its goals.
2. They schedule study sessions (linked to the calendar).
3. They track progress through topics.
4. The AI builds a study schedule toward a deadline.

---

## 5. UI Requirements

- Subject list with progress.
- Study session scheduler.
- Topic checklists.
- 'Generate study plan' AI action.

---

## 6. AI Behavior

Given a subject, deadline, and available time, the AI produces a spaced, realistic study plan, breaks topics into sessions, and adapts as the user progresses.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores `Subject` (userId, title, progress) and `StudySession` (userId, subjectId, scheduledAt, done). Study goals link to `Goal`.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /study/subjects | List subjects |
| POST | /study/subjects | Add subject |
| POST | /study/sessions | Schedule session |
| POST | /study/plan | AI study plan |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- `title`: required.
- Sessions reference user-owned subjects.
- Deadlines valid.

---

## 10. Notifications

- Study session reminders.
- Deadline approaching.

---

## 11. Analytics

Track: study time, sessions completed, topics mastered. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Overloaded schedule → AI warns and rebalances.
- Missed sessions → replanned.
- No time available → AI suggests minimum viable plan.

---

## 13. Acceptance Criteria

- [ ] User can manage subjects and sessions.
- [ ] Sessions integrate with the calendar.
- [ ] AI generates a realistic study plan.
- [ ] All states handled.

---

## 14. Future Expansion

- Flashcards / spaced repetition.
- Resource attachments.
- Progress quizzes.

---

## 15. Cross-References

- Calendar → *02-PRD / Calendar.md*
- Goals → *02-PRD / Goal Engine.md*
- AI → *03-Architecture / AI Architecture.md*

---

*End of PRD — Study Planner — v1.0*
