# PRD — AI Memory

**Version:** 1.0
**Part of:** Life OS Blueprint / 02-PRD
**Phase:** 3 (AI Engine) — build before the Coach
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

AI Memory is the engine that lets Life OS remember the user. It stores facts, preferences, and summaries as vector embeddings and retrieves the most relevant ones for every AI interaction. It is the foundation every AI feature depends on.

---

## 2. Business Objective

- Make Life OS's AI persistent and personal.
- Provide relevant context to every AI feature.
- Create the memory moat that grows switching cost over time.

---

## 3. User Stories

- As a user, the AI remembers my goals and preferences.
- As a user, I don't have to repeat myself.
- As a user, the AI's advice reflects my history.

---

## 4. UX Flow

1. Memory works invisibly behind the AI features.
2. Optionally, the user can view and manage what the AI remembers.
3. The user can delete a memory.

---

## 5. UI Requirements

- (Mostly invisible.) Optional 'What the AI remembers' settings view.
- Ability to delete individual memories.

---

## 6. AI Behavior

On write: important facts are embedded and stored as `MemoryItem`. On read: the query is embedded and a vector similarity search returns the top-k relevant memories to inject into the prompt. Old context is summarized into compact memories.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Uses the `MemoryItem` model with `embedding vector(1536)` via pgvector. Indexed for fast similarity search, scoped by userId.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| POST | /memory | Store a memory (internal) |
| GET | /memory | List user's memories |
| POST | /memory/search | Semantic retrieve (internal) |
| DELETE | /memory/:id | Delete a memory |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- Memories are strictly user-scoped.
- Content length-limited.
- Embedding dimension fixed.

---

## 10. Notifications

- None (background system).

---

## 11. Analytics

Track: memories stored, retrieval hits, memory size per user. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- No relevant memory → AI proceeds with structured data only.
- Embedding failure → retry via background job.
- Contradictory memories → newest/most relevant wins.
- User deletes memory → removed from retrieval immediately.

---

## 13. Acceptance Criteria

- [ ] Facts are embedded and stored.
- [ ] Similarity search returns relevant, user-scoped memories.
- [ ] Memories inject into AI prompts.
- [ ] Users can view and delete memories.

---

## 14. Future Expansion

- Memory importance decay/weighting.
- Automatic summarization pipelines.
- Memory categories and reasoning over them.

---

## 15. Cross-References

- AI architecture → *03-Architecture / AI Architecture.md*
- Database (pgvector) → *03-Architecture / Database.md*
- AI Coach → *02-PRD / AI Coach.md*
- AI Search → *02-PRD / AI Search.md*

---

*End of PRD — AI Memory — v1.0*
