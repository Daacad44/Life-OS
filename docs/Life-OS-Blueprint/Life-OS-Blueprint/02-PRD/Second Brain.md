# PRD — Second Brain

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

The Second Brain is the user's personal knowledge base: notes, ideas, and documents captured and organized. Combined with AI Search, it lets users store and retrieve everything they know and think.

---

## 2. Business Objective

- Give users one place to capture knowledge.
- Make captured knowledge retrievable and useful.
- Feed the AI with the user's ideas and notes.

---

## 3. User Stories

- As a user, I can quickly capture a note or idea.
- As a user, I can organize notes with tags/folders.
- As a user, I can search my notes semantically.
- As a user, my notes inform my AI coach.

---

## 4. UX Flow

1. User captures a note via quick-add or the notes page.
2. Notes are organized by tags or folders.
3. User searches and finds notes by meaning, not just keywords.

---

## 5. UI Requirements

- Notes list and editor.
- Tags/folders.
- Rich-text (markdown) editing.
- Search bar.
- Empty state: 'Capture your first idea.'

---

## 6. AI Behavior

Notes are embedded for semantic search (via AI Search). The AI can summarize notes, extract action items into tasks, and pull relevant notes into coaching.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Uses the `Note` model. Notes are embedded into `MemoryItem`/a vector store for search.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /notes | List notes |
| POST | /notes | Create note |
| GET | /notes/:id | Get note |
| PATCH | /notes/:id | Update note |
| DELETE | /notes/:id | Delete note |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- `title`/`content`: content required.
- Size limits on note content.
- User-scoped.

---

## 10. Notifications

- Optional reminders on notes.

---

## 11. Analytics

Track: notes created, searched, converted to tasks. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Very large notes → chunked for embedding.
- Deleting a note → removed from search index.
- Empty note → not saved.

---

## 13. Acceptance Criteria

- [ ] User can CRUD notes with tags.
- [ ] Notes are searchable semantically.
- [ ] Notes feed AI features.
- [ ] All states handled.

---

## 14. Future Expansion

- Backlinks between notes.
- Web clipper.
- Note templates.
- Rich media.

---

## 15. Cross-References

- AI Search → *02-PRD / AI Search.md*
- AI Memory → *02-PRD / AI Memory.md*
- Database → *03-Architecture / Database.md*

---

*End of PRD — Second Brain — v1.0*
