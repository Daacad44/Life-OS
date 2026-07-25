# PRD — Career Planner

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

The Career Planner helps users manage their professional growth: career goals, skills to build, milestones, and progress. It turns vague career ambitions into a structured, trackable path with AI guidance.

---

## 2. Business Objective

- Help users grow their careers intentionally.
- Turn career ambitions into concrete plans.
- Use AI to advise on skills and next steps.

---

## 3. User Stories

- As a user, I can set career goals.
- As a user, I can track skills I'm building.
- As a user, I can map milestones toward a role.
- As a user, I can get AI career guidance.

---

## 4. UX Flow

1. User defines a career goal (e.g. a target role).
2. They add skills to develop and milestones.
3. Progress tracks as skills and milestones complete.
4. The AI suggests a path and next steps.

---

## 5. UI Requirements

- Career goal view.
- Skills tracker with levels.
- Milestone timeline.
- AI guidance panel.

---

## 6. AI Behavior

The AI maps a path to a career goal: skills needed, a milestone sequence, and concrete next actions. It advises on gaps and opportunities based on the user's context.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores `CareerGoal`, `Skill` (userId, name, level), `Milestone` (userId, title, done). Links to `Goal`.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /career/overview | Career overview |
| POST | /career/skills | Add skill |
| POST | /career/milestones | Add milestone |
| POST | /career/plan | AI career plan |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- Required fields present.
- Skill levels within range.
- User-scoped.

---

## 10. Notifications

- Milestone reminders.
- Skill progress check-ins.

---

## 11. Analytics

Track: skills progressed, milestones hit, plan engagement. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Vague goal → AI asks clarifying questions.
- No milestones → AI proposes some.
- Career change → replan cleanly.

---

## 13. Acceptance Criteria

- [ ] User can manage career goals, skills, milestones.
- [ ] AI generates a career path.
- [ ] Progress tracks correctly.
- [ ] All states handled.

---

## 14. Future Expansion

- Resume/CV integration.
- Job-market insights.
- Mentorship matching.

---

## 15. Cross-References

- Goals → *02-PRD / Goal Engine.md*
- AI Coach → *02-PRD / AI Coach.md*
- Analytics → *02-PRD / Life Analytics.md*

---

*End of PRD — Career Planner — v1.0*
