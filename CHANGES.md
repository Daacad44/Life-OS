# AI Provider Migration — Claude → Google Gemini (2026-08-10)

A **provider-only** migration: every AI feature keeps its exact behavior, prompts,
and UI — only the underlying LLM/embedding provider changed. The app already routed
all AI through a single **AI Service Layer** (`backend/src/ai/`), so the swap stayed
contained there plus config and docs. Twelve feature services (AI Coach, Reflection,
Weekly Review, AI Search, Smart Recommendations, goal/study/career/health/analytics
insight, habit insight, voice) were untouched — they still call `generateText` /
`generateJson` / `streamText` / `embed`.

## What was swapped

- **Chat / JSON / streaming:** Anthropic Claude (`@anthropic-ai/sdk`, `claude-opus-5`)
  → **Google Gemini** via `@google/genai`.
  - `client.ts` now holds a lazy `GoogleGenAI` singleton (still throws `503
AI_UNAVAILABLE` when no key — "the app works with AI switched off").
  - `service.ts` maps our provider-agnostic request onto Gemini: `system` →
    `systemInstruction`, messages → `contents` with `user`/`model` roles,
    `maxTokens` → `maxOutputTokens`, `thinking` → `thinkingConfig` (`thinkingBudget`
    `-1` adaptive when requested, omitted otherwise so the model uses its default),
    usage → `usageMetadata` (`promptTokenCount` /
    `candidatesTokenCount`), streaming via `generateContentStream`, JSON via
    `responseMimeType: application/json` (plus the existing strict-JSON instruction +
    tolerant parse). Rate limiting, usage logging, error mapping, and the Coach's
    graceful fallback are all preserved.
- **Embeddings / AI memory:** Voyage AI (`voyage-3.5`, 1024-dim REST) → **Gemini**
  `embedContent` (`gemini-embedding-001`) at **1536 dims**, L2-normalized (Gemini only
  pre-normalizes its full 3072-dim output; reduced dims must be normalized for cosine
  search).
- **Provider abstraction hardened:** introduced a provider-agnostic `ChatMessage`
  type; removed the last `@anthropic-ai/sdk` type leak from `coachService.ts`. No
  feature imports a provider SDK anymore.

## New env vars (server-side only, never in the frontend)

| Var                      | Default                | Purpose                                    |
| ------------------------ | ---------------------- | ------------------------------------------ |
| `GEMINI_API_KEY`         | — (required in prod)   | Gemini API key                             |
| `GEMINI_MODEL`           | `gemini-3.6-flash`     | Main chat/completions model                |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-001` | AI-memory embedding model                  |
| `GEMINI_EMBEDDING_DIM`   | `1536`                 | Embedding width; **must** match the schema |

Removed: `CLAUDE_API_KEY`, `VOYAGE_API_KEY`. `backend/src/app.ts` now **fails fast in
production** if `GEMINI_API_KEY` is missing (warns, doesn't crash, in dev). Updated
`backend/.env.example` and `03-Architecture/Deployment.md` (Coolify runtime var + old
key removal + no-frontend-leak note).

## Chosen models

- **Chat:** `gemini-3.6-flash` — current Flash generation; fast, cost-effective, strong
  agentic/planning fit for the Coach. Override `GEMINI_MODEL` to a Pro-tier model for
  deeper reasoning, no code change.
- **Embedding:** `gemini-embedding-001` @ 1536 dims — the GA, free-tier text embedding
  model (supports 3072/1536/768; 1536 is also the column's original width before it was
  narrowed for Voyage). `gemini-embedding-2` exists only as a `*-preview` id, so the
  stable GA model is used.
- Model IDs were **verified against the live docs (ai.google.dev)** and free-tier
  availability confirmed.

## Schema / migration

- `prisma/migrations/20260810120000_memory_embedding_gemini_1536_dim/` alters
  `MemoryItem.embedding` from `vector(1024)` → `vector(1536)`.
- Old 1024-dim Voyage vectors are **cleared** in the same migration (a dimension change
  invalidates them, and pgvector rejects an in-place cast across widths). Row **content
  is preserved**; embeddings are `NULL` until re-generated. No pgvector index exists on
  the column, so nothing to rebuild.

## SDK note

The prompt named `@google/generative-ai`, but that package is the **legacy/frozen** SDK
(last published Apr 2025). Google's current, actively-maintained official Node SDK is
**`@google/genai`** (v2.16.x) — used here, consistent with the prompt's "verify against
live docs / treat defaults as non-certain" rule.

## Verification

- `npm run build` (shared + frontend + backend), `npm run lint` (0 errors), backend
  tests (15/15) and frontend tests (9/9) all **pass**. `tsc --noEmit` clean.
- Grep-confirmed **zero** `anthropic`/`claude`/`voyage` references remain in code or
  config; the only surviving "Claude" mentions are docs referring to _Claude Code /
  Cursor_ the coding assistant, plus the Deployment note instructing operators to remove
  the old keys.
- Gemini SDK contract (`generateContent`, `generateContentStream`, `embedContent`,
  `ApiError`) verified at runtime.

## Follow-ups

- **Live end-to-end test** each AI feature against a real `GEMINI_API_KEY` in a running
  environment (Postgres + Redis) — the CI sandbox has no key/infra, so live calls
  weren't exercised here: AI Coach (incl. streaming), Reflection, Weekly Review, AI
  Search, Smart Recommendations, goal/study/career breakdowns, voice.
- **Re-embed existing memories.** Because the embedding model + dimension changed, any
  pre-existing `MemoryItem` rows need re-embedding (their vectors are now `NULL`). Notes
  re-embed on next edit; conversation-derived memories regenerate as the Coach is used.
  Consider a one-off backfill script if a production DB already has memory rows.
- Remove `CLAUDE_API_KEY` / `VOYAGE_API_KEY` from Coolify after verification.

---

# Life OS — Production Hardening Changes

This pass took the deployed app from a mock-data prototype to a real,
mobile-responsive product **without changing the approved UI design**. The
navy/amber design, layout, and components are preserved; only data and behavior
became real.

---

# Production Feature Upgrade (2026-08-08)

A follow-up pass that took seven features to production quality and added a
**system-wide reminder + audible-alarm** capability and a **Done/Cancel exit
guard**, without changing the approved UI design. Built the two cross-cutting
systems once, then used them everywhere.

## Global A — Reminders + audible alarm (system-wide)

Every reminder in the app now produces a real in-app notification **and** an
audible alarm, done professionally.

- **Backend.** `Reminder` gained `acknowledgedAt` + `offsetLabel`. The 60s
  in-process scheduler (`reminderScheduler.ts`) marks reminders `sentAt`,
  respects the `reminders` preference and quiet hours (defers, never drops),
  auto-cancels a reminder when its item is completed/deleted, and dedupes via
  `sentAt`. New endpoints: `GET /v1/reminders/alarms` (fired-but-undismissed,
  with the resolved item title), `POST /v1/reminders/:id/acknowledge`,
  `POST /v1/reminders/:id/snooze`. Snooze re-arms (clears sent/ack, pushes
  `remindAt`). A shared `reminderEntity` resolver backs both the scheduler and
  the alarm endpoint and now covers `task | event | habit | goal | subgoal`.
- **User settings.** `soundEnabled` (global mute), `alarmSound`, `alarmVolume`
  on `User`, surfaced via profile GET/PATCH and the Settings → Notifications tab
  (sound picker, volume, mute, Test button). Quiet hours already existed.
- **Frontend.** A Web Audio alarm engine (`lib/alarm.ts`) synthesizes five
  selectable chimes at the chosen volume — no binary asset — and unlocks audio
  on first interaction (autoplay policy). `AlarmProvider` (mounted in the app
  shell) polls `/reminders/alarms` every 20s, plays the alarm, and shows a
  per-reminder alert naming the item with **Snooze 5/10/15** and **Done**;
  falls back to the Notifications API + vibration when the tab is hidden.
- **Extensible.** Email/push can be layered behind the same `notify()` pipeline
  and reminder rows without rework.

## Global B — Done/Cancel exit guard (every flow)

- `GuardedModal` intercepts scrim/Escape/X/Cancel while a form is dirty and asks
  **Done (save)** vs **Discard** instead of silently losing work.
  `useNavigationGuard` (react-router `useBlocker` + `beforeunload`) does the same
  for route-based flows (Focus, Notes). `ConfirmDialog` is the shared prompt.
- Wired into Tasks, Goals, Calendar, Focus, and Notes; inline add forms (Planner,
  Habits, sub-goals) keep typed input until submitted.

## Per-feature

- **Planner.** Plan items take an optional time + reminder (audible), read as a
  schedule, and preserve their time-of-day when dragged to another day.
- **Tasks.** Recurring tasks (DAILY/WEEKLY-with-weekdays/MONTHLY + interval +
  time) — a rolling-window generator materializes occurrences and their
  reminders each scheduler tick (DST-safe wall-time→UTC). Subtasks (CRUD +
  checklist), tags, and reminders with offset labels. Endpoints:
  `/v1/tasks/recurring` (CRUD), `/v1/tasks/:id/subtasks`,
  `/v1/tasks/subtasks/:id`.
- **Goals.** Goal start date + datetime deadline; per-sub-goal deadline; deadline
  reminders fire the alarm (new `subgoal` reminder entity). Progress still
  derives from sub-goals for analytics/AI.
- **Calendar.** Event reminder **fixed** — relative presets (at time / N before /
  custom) on create **and** edit; editing syncs the reminder (no stale/dupes);
  fired reminders raise the alarm.
- **Habits.** Optional time-of-day → a generator queues daily/weekly reminders
  (skips today once checked in; clears on time-change/delete) that raise the alarm.
- **Focus.** Configurable Pomodoro (focus/break) tied to a real task, alarm at
  interval/break end, time logged to the task + analytics, exit guard on a
  running session.
- **Notes.** Folders + full-text search (`q`/`folder` query params), debounced
  autosave with live state, exit guard on unsaved edits.

## New migration (run in each environment)

`prisma/migrations/20260808120000_production_upgrade` adds: `User` alarm
settings; `Reminder.offsetLabel` + `acknowledgedAt`; `Task.tags` +
`recurringTaskId`; `Subtask` and `RecurringTask` tables; `Goal.startDate`;
`SubGoal.dueDate`; `Habit.timeOfDay`; `Note.folder`. The reminder/alarm,
recurring-task, and habit-reminder features depend on it.

## Verification

- `npm run build` (shared + frontend `vite build` + backend `tsc`) passes clean.
- Tests: backend 15/15, frontend 9/9. `eslint .` reports 0 errors.

## Follow-ups

- Reminders/alarms poll (20s) and the scheduler ticks (60s); websockets/push are
  the eventual upgrade, and the pipeline is already structured for it.
- Editing an existing recurring template from the UI (create + delete exist);
  a dedicated "manage recurring" screen is a natural next step.

---

## TL;DR

- All 11 prototype screens now render the authenticated user's **real data**
  through the existing typed React Query hooks — no mock/sample arrays remain.
- Every data view has the full lifecycle: **loading skeletons, friendly empty
  states, error + retry, and live success** with working mutations.
- A single **timezone-aware date/time picker** is used everywhere; datetimes are
  stored in UTC and displayed in the user's timezone.
- New: **Reminders** (backend model + scheduled worker + in-app delivery) and a
  global **⌘K Command Bar** for quick capture and navigation.

## Mock data removed, per screen

Each screen previously rendered a hardcoded array marked `// MOCK`. Replaced with:

| Screen        | Mock removed                                                                           | Now sourced from                                                                           |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Dashboard     | fake stats (`12`, `2h 45m`, `62%`), 5 fake plan tasks, canned coach text, static chart | `useDashboard()`, `useFocusSessions()`, real task toggle; chart = real 7-day focus minutes |
| Tasks         | 5 fake tasks, fake tags/subtasks/detail                                                | `useTasks` + create/update/delete; real priority, due date, status                         |
| Goals         | 4 fake goals                                                                           | `useGoals` + `useCreateGoal`; real progress + target dates                                 |
| Calendar      | 5 events hardcoded to May 2026, `TODAY=19`                                             | `useEvents` for the visible range + real task deadlines                                    |
| Habits        | 5 fake habits/streaks                                                                  | `useHabits` + `useCheckin`; streak + done-today from real check-ins                        |
| AI Coach      | seeded conversation + canned `COACH_REPLY`                                             | `useCoachHistory` + streamed `useCoachChat`                                                |
| Analytics     | fake stats, fake chart points, fake priority split                                     | `useAnalyticsOverview/Insights`, real sessions, real task priority split                   |
| Finance       | fake income/expenses, 4 fake transactions                                              | `useBudgetOverview` + `useTransactions` + create                                           |
| Notifications | 4 fake notifications                                                                   | `useNotifications` + mark-read / mark-all-read                                             |
| Focus         | hardcoded `2h 15m / 4 / 8` summary                                                     | real `useFocusSessions` + persisted start/end                                              |
| Settings      | fallback `Alex Morgan`, non-saving form                                                | `useUpdateProfile`, real theme, real notification prefs, data export/delete                |

The older feature pages (Planner, Notes, Health, Study, Career, Business,
Community, Recommendations, Weekly Review, Reflection, Achievements, Voice,
Automations, Goal detail) were already wired to real hooks and were left as-is.

## Four states

Every list/data view now shows: **loading** (skeletons, not blank/spinner),
**empty** (the friendly design prompt, only when real data is truly empty),
**error** (message + retry), and **success**. All create/update/delete/complete/
check-in actions call the API and invalidate the affected queries.

## Dates, times & timezones

- `frontend/src/lib/datetime.ts` — UTC⇄wall-time conversion, timezone-correct
  `Today / Tomorrow / Overdue`, and display formatters.
- `frontend/src/components/form/DateTimeField.tsx` — the single shared date/time
  picker (16px to avoid iOS zoom), used for task due dates, event start/end, goal
  target dates, and reminders.
- All datetimes are stored in UTC; display and day math use the user's timezone
  from Settings (falling back to the browser zone).

## Endpoints added

Every screen's data endpoint already existed and is user-scoped. The net-new
backend surface in this pass:

- `GET/POST /v1/reminders`, `DELETE /v1/reminders/:id` — user-scoped reminders
  (route → controller → service → repository).
- `updateProfile` extended with `quietHoursStart` / `quietHoursEnd`.
- `reminders` added as a notification preference category.

## Reminder worker

- Prisma `Reminder` model links to a `task | event | habit | goal`
  (`entityType` + `entityId`), with `remindAt`, optional `message`, and `sentAt`.
- An in-process scheduler (`backend/src/services/reminderScheduler.ts`, 60s
  interval, started from `app.ts`) finds due, unsent reminders and delivers them
  as in-app notifications via the existing `notify()` path.
- It **respects** the `reminders` preference and the user's **quiet hours**
  (deferring, not dropping), **dedupes** via `sentAt` (never re-sends), and
  **clears** a reminder automatically when its item is completed or deleted.
- Structured so email/push channels can be layered on later behind `notify()`.
- Reminders can be set from the task/event forms and from the command bar's
  natural quick-add ("call mom tomorrow 5pm").

## Global Command Bar (⌘K)

- `Cmd/Ctrl+K` anywhere, plus the topbar search button (desktop + mobile).
- Quick-create a **task, note, event, or habit** and **jump** to any screen,
  fully keyboard-navigable (arrows + enter, esc), wired to the real APIs.
- Natural quick-add parses due date/time for tasks/events
  (`frontend/src/lib/quickAdd.ts`) and offers a reminder when a time is present.

## Mobile responsiveness

- App shell: navy sidebar becomes a scrim-backed off-canvas drawer (hamburger,
  closes on navigation); `min-h-dvh`; `pointer-coarse` 44px touch targets.
- Calendar month grid → agenda list on mobile; Finance/Analytics use stacked
  cards (no tables); charts are `width:100%` SVGs that scale.
- Shared inputs are 16px to prevent iOS focus-zoom.

## Brand colors

Navy `#0B1F3A` and Amber `#F59E0B` are defined as `@theme` tokens in
`frontend/src/index.css` and applied throughout. Audit found **zero** stray
default blue/indigo classes or hexes — no changes required.

## Verification

- `tsc` (frontend + backend) and `vite build` pass clean.
- Test suites pass: frontend 9/9, backend 15/15.
- `eslint .` reports 0 errors (a few pre-existing fast-refresh/deps warnings).

## Follow-ups

- Run the new Prisma migration in each environment:
  `prisma/migrations/20260805120000_add_reminders_and_quiet_hours` (adds the
  `Reminder` table and User quiet-hours columns). The reminder scheduler and
  quiet-hours logic depend on it.
- Reminders can currently be set when **creating** a task/event (and edited items
  get a new reminder); a dedicated "manage existing reminders" UI is a natural
  next step.
- Notifications currently poll every 60s; websockets/push are the eventual
  upgrade, and the reminder pipeline is already structured for it.
- A device-by-device QA sweep (real iOS/Android Safari/Chrome) is recommended to
  complement the breakpoint work done here.
