# UX Guidelines

**Version:** 1.0
**Part of:** Life OS Blueprint / 04-Design
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [UX Principles](#2-ux-principles)
3. [Core Navigation](#3-core-navigation)
4. [Onboarding](#4-onboarding)
5. [The Daily Loop](#5-the-daily-loop)
6. [Empty, Loading & Error States](#6-empty-loading--error-states)
7. [AI Interaction UX](#7-ai-interaction-ux)
8. [Accessibility](#8-accessibility)
9. [Wireframing Process](#9-wireframing-process)
10. [Cross-References](#10-cross-references)

---

## 1. Purpose

This document defines how Life OS should *feel* to use — the interaction patterns and flows that keep a large, feature-rich product simple and pleasant.

---

## 2. UX Principles

1. **One primary action per screen.** Never make the user hunt.
2. **Progressive disclosure.** Show the essential; reveal depth on demand.
3. **Fast feedback.** Every action responds instantly (optimistic UI where safe).
4. **Forgiving.** Easy undo; confirm destructive actions.
5. **Consistent patterns.** The same interaction works the same way everywhere.

---

## 3. Core Navigation

- **Sidebar** — primary navigation between features (Dashboard, Tasks, Goals, Calendar, Habits, etc.).
- **Top bar** — search, quick-add, notifications, profile.
- **Quick-add** — a global shortcut to add a task/note/goal from anywhere.
- **Command palette** (later) — keyboard-driven navigation and actions.

The Dashboard is home base; everything is one click away.

---

## 4. Onboarding

First-run experience:

1. Sign up.
2. A short, friendly setup: name, timezone, main goals.
3. The AI coach introduces itself and asks 2–3 questions to seed its memory.
4. The user lands on a dashboard already populated with their first goal and a suggested task.

Goal: the user feels understood within the first two minutes.

---

## 5. The Daily Loop

The core habit Life OS builds:

```
Open → see today's plan → act on tasks → check in habits → quick reflection → AI coaches
```

The daily view is the heart of the product. It should be the fastest, smoothest screen in the app.

---

## 6. Empty, Loading & Error States

Every screen must handle three states well:

- **Empty:** a friendly prompt + a clear action ("No tasks yet — add your first one").
- **Loading:** skeletons, never blank screens or spinners alone.
- **Error:** a clear message + a retry option, never a raw error.

Good empty states are part of onboarding — they teach the user what to do.

---

## 7. AI Interaction UX

- The AI coach is present but never intrusive.
- AI suggestions are clearly marked as suggestions the user can accept or dismiss.
- The AI explains its reasoning briefly when it matters.
- AI responses stream in for a responsive feel.
- The user is always in control — the AI proposes, the user decides.

---

## 8. Accessibility

- Keyboard navigable throughout.
- Visible focus states.
- Sufficient color contrast (see *Colors.md*).
- Screen-reader-friendly labels.
- Respect reduced-motion preferences.

---

## 9. Wireframing Process

Life OS does **not** wireframe all 25 features upfront. Wireframes are produced **low-fidelity and per-feature**, immediately before that feature is built — mirroring the "one PRD at a time" build philosophy.

- **Scope:** only the feature currently being built gets a wireframe. No wireframe backlog.
- **Fidelity:** low-fi (boxes, labels, flow arrows) — enough to validate layout and the primary action, not a pixel-perfect mock. shadcn/ui components resolve the visual detail at build time.
- **Source:** derived directly from that feature's PRD (UX Flow + UI Requirements sections) and the Design System tokens.
- **Phase 2 first:** the six core screens (Dashboard, Tasks, Planner, Goals, Calendar, Habits) are the only screens wireframed before the V1 checkpoint (see *Life OS Development Roadmap*, Section 15).

---

## 10. Cross-References

- Design system → *04-Design / Design System.md*
- Components → *04-Design / Components.md*
- Frontend → *03-Architecture / Frontend.md*
- Dashboard spec → *02-PRD / Dashboard.md*
- Build philosophy → *Life OS Development Roadmap*

---

*End of UX Guidelines — v1.0*
