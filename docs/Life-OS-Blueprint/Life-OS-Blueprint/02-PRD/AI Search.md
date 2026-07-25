# PRD — AI Search

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

AI Search lets users find anything across Life OS by meaning, not just keywords. It searches tasks, goals, notes, and reflections using vector embeddings, and can answer questions about the user's own data.

---

## 2. Business Objective

- Make everything in Life OS instantly findable.
- Let users ask questions about their own life data.
- Showcase the power of the memory/vector layer.

---

## 3. User Stories

- As a user, I can search across all my data at once.
- As a user, I can find things by meaning, not exact words.
- As a user, I can ask 'what did I plan for my fitness goal?' and get an answer.

---

## 4. UX Flow

1. User opens global search (or command palette).
2. Types a natural-language query.
3. Results show matches across tasks, goals, notes, reflections.
4. Optionally, the AI answers the question using the results.

---

## 5. UI Requirements

- Global search bar / command palette.
- Grouped results by type.
- An 'ask AI' answer option.

---

## 6. AI Behavior

The query is embedded and run against the user's vector store (notes, memories, etc.). Top matches are returned, and optionally passed to Claude to synthesize a direct answer (RAG).

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Reads from `MemoryItem` and note embeddings (pgvector). No new primary tables.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| POST | /search | Semantic search |
| POST | /ai/search | Search + AI answer |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- Query length-limited.
- Strictly user-scoped results.
- Rate-limited.

---

## 10. Notifications

- None.

---

## 11. Analytics

Track: searches run, result clicks, AI answers used. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- No matches → helpful empty state.
- Ambiguous query → return broad matches.
- AI answer fails → still show raw results.

---

## 13. Acceptance Criteria

- [ ] Semantic search returns relevant, user-scoped results.
- [ ] Results span multiple data types.
- [ ] AI can answer questions from results.
- [ ] Fast and rate-limited.

---

## 14. Future Expansion

- Filters by type/date.
- Saved searches.
- Voice search.

---

## 15. Cross-References

- AI Memory → *02-PRD / AI Memory.md*
- Second Brain → *02-PRD / Second Brain.md*
- AI architecture → *03-Architecture / AI Architecture.md*

---

*End of PRD — AI Search — v1.0*
