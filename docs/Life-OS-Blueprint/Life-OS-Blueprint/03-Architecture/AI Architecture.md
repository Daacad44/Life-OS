# AI Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Principles](#2-principles)
3. [The AI Service Layer](#3-the-ai-service-layer)
4. [AI Memory Engine](#4-ai-memory-engine)
5. [Prompt System](#5-prompt-system)
6. [Retrieval Flow (RAG)](#6-retrieval-flow-rag)
7. [Token & Cost Management](#7-token--cost-management)
8. [Safety & Guardrails](#8-safety--guardrails)
9. [Where AI Is Used](#9-where-ai-is-used)
10. [Cross-References](#10-cross-references)

---

## 1. Purpose

This document defines how intelligence works in Life OS: the AI service layer, the memory engine (pgvector), the prompt system, and how retrieval-augmented generation gives the AI context about the user. It is the blueprint for every AI-powered feature.

---

## 2. Principles

1. **AI is a layer, not the base.** The app works with AI switched off.
2. **All AI runs on the backend.** The frontend never calls Claude directly.
3. **Memory makes it personal.** The AI is only useful because it remembers the user.
4. **Data before AI.** A feature's tables must exist before its AI layer is added.
5. **Deterministic where possible.** Use AI for reasoning, not for things plain code can do.

---

## 3. The AI Service Layer

Every AI call goes through one internal module (`src/ai`). It is the single gateway to the Claude API and is responsible for:

- Building prompts from templates.
- Fetching relevant memory (via pgvector).
- Sending requests to the Claude API.
- Handling retries, timeouts, and fallbacks.
- Tracking token usage per user.
- Enforcing rate limits.
- Storing results and new memories.

```
Feature Service → AI Service Layer → [ memory lookup ] → Claude API → response → [ store memory ] → Feature Service
```

No feature ever talks to Claude directly — always through this layer.

---

## 4. AI Memory Engine

Memory is what turns Life OS from a tool into a coach. It has two kinds:

- **Short-term / working memory** — the current conversation or task context, passed in the prompt.
- **Long-term memory** — durable facts, preferences, and summaries stored as `MemoryItem` rows with vector embeddings.

**Write path:** important facts (goals, preferences, patterns, reflections) are embedded and stored.
**Read path:** before an AI response, the system embeds the query, runs a similarity search against the user's memories, and injects the top matches into the prompt.

Memory is always scoped to a single user.

---

## 5. Prompt System

- Prompts are **templates**, not hardcoded strings scattered in code.
- Each AI feature has its own template (Coach, Reflection, Weekly Review, etc.).
- A template defines: system role, task instructions, injected memory, injected user data, and output format.
- Structured outputs (e.g. a plan, a list) request **JSON only**, which is parsed safely.

---

## 6. Retrieval Flow (RAG)

The standard retrieval-augmented generation flow for a personalized response:

1. Receive the user request (e.g. "plan my day").
2. Gather structured context (today's tasks, active goals, habits) from the database.
3. Embed the request and query pgvector for relevant long-term memories.
4. Assemble the prompt: system role + structured data + retrieved memories + request.
5. Call the Claude API.
6. Parse and validate the response.
7. Store any new durable memory.
8. Return the result to the feature.

---

## 7. Token & Cost Management

- Every AI call records tokens used, per user.
- Only the most relevant memories are injected (top-k), not the whole history.
- Long context is summarized into compact memories rather than re-sent each time.
- Heavy AI tasks run as background jobs, not in the request cycle.
- Optional per-user rate limits protect cost.

---

## 8. Safety & Guardrails

- User input is never trusted directly in prompts without structure.
- The AI never receives another user's data — memory is user-scoped.
- Outputs that trigger actions (creating tasks, events) are validated before being applied.
- Fallbacks: if the AI fails, the feature degrades gracefully to its non-AI behavior.

---

## 9. Where AI Is Used

| Feature | AI Role |
|---------|---------|
| AI Personal Coach | Reads user data + memory, gives guidance |
| AI Goal Engine | Breaks goals into steps, suggests actions |
| Smart Daily Planner | Prioritizes and schedules tasks |
| AI Habit System | Detects patterns, nudges |
| AI Reflection | Guided reflection prompts |
| AI Weekly Review | Summarizes the week, plans the next |
| AI Search | Semantic search across everything |
| Smart Recommendations | Cross-feature proactive suggestions |
| Voice Assistant | Natural-language control |

---

## 10. Cross-References

- Overall system → *03-Architecture / System Architecture.md*
- Backend → *03-Architecture / Backend.md*
- Memory storage → *03-Architecture / Database.md* (MemoryItem + pgvector)
- AI Coach spec → *02-PRD / AI Coach.md*
- AI Memory spec → *02-PRD / AI Memory.md*

---

*End of AI Architecture — v1.0*
