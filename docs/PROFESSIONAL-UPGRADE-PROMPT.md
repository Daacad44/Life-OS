# Life OS — Professional Upgrade Prompt

> **Isticmaalka / How to use this**
> Kani waa *prompt* professional ah oo diyaar u ah in la siiyo AI coding agent (Claude Code / Cursor / etc.).
> Ku qor sida uu yahay, ama qeyb qeyb u qaado. Prompt kastaa wuxuu leeyahay: **Goal → Current state → Acceptance criteria → Files to touch**.
> Habka lagu shaqeeyo: **hal feature mar, vertical slice (DB → API → UI), data before AI** — sida `docs/.../Life OS Development Roadmap.md`.

---

## 0. Global rules (ku dar prompt kasta)

You are a senior full-stack engineer working on **Life OS** (React + TypeScript + Vite + Tailwind + shadcn/ui frontend, Node + Express + TypeScript + Prisma + PostgreSQL backend, shared Zod schemas in `packages/shared`).

Every change MUST follow these standards:

1. **Type-safe end to end.** Types and validation live in `packages/shared` (Zod). Frontend and backend both import from `@life-os/shared`. No `any`, no untyped fetch.
2. **Vertical slices.** For any feature: define the shared Zod schema + type → backend route/controller/repository → React Query hook → UI. Never build UI on data the API doesn't return yet.
3. **Full CRUD by default.** Every entity the user can create must also be **readable, editable, and deletable** from the UI, with optimistic-or-invalidating React Query mutations and a confirm dialog on delete.
4. **State & data fetching.** Use TanStack React Query for all server state (`useX` hooks under `features/<x>/hooks`). Local form state only for drafts.
5. **Accessibility & UX.** Every interactive control keyboard-usable, labelled, ≥44px touch target on coarse pointers, loading/empty/error states handled (`Skeleton`, `EmptyState`, error + Retry).
6. **Reuse the design system.** Use `@/components/ui-kit` (`Card`, `Button`, `Modal`, `ConfirmDialog`, `EmptyState`, `StatCard`, `Tabs`, `Input`, `Badge`, `ProgressBar`) and the navy/amber theme. Do not invent one-off styles.
7. **No regressions.** `npm run lint` and `npm run build` must pass. Do not remove existing routes or nav entries.
8. **i18n aware.** The app supports English + Somali (`en`/`so`). Any user-facing string added should respect the existing language preference pattern.

---

## 1. Planner — full CRUD (BUG FIX + FEATURE)

**Goal.** Make the Planner a fully professional, full-CRUD daily planner. Right now a user can add items but cannot reliably **edit** or **delete** each planned item, and there is no clean update flow.

**Current state.**
- `frontend/src/features/planner/` → `PlannerList.tsx`, `PlannerQuickAdd.tsx`, `SortableTaskItem.tsx`, `DateSwitcher.tsx`, `hooks/usePlanner.ts`, `api.ts`
- Backend: `backend/src/controllers/plannerController.ts` (+ its route/repository)

**Acceptance criteria.**
- [ ] **Create:** Quick-add stays; also allow adding with a time/priority.
- [ ] **Read:** Items load per selected day (`DateSwitcher`), sorted, with loading/empty/error states.
- [ ] **Update:** Each planner item can be **edited inline or in a modal** — title, time, priority, notes, and status (todo/done). Reordering (drag) persists to the backend.
- [ ] **Delete:** Each item has a delete action guarded by `ConfirmDialog`; list updates via React Query invalidation.
- [ ] Optimistic toggle for done/undone; rollback on error.
- [ ] Empty state with a clear CTA; error state with Retry.

**Files to touch.** `features/planner/**`, `packages/shared` (planner schema: `createPlannerItemSchema`, `updatePlannerItemSchema`), `backend/src/controllers/plannerController.ts` + route + repository.

---

## 2. Goals — fix the "letter-by-letter" typing bug + full CRUD

**Goal.** When typing a goal, the user can currently only type **one character at a time / the field loses focus** ("xaraf xaraf... lama boob siin karo"). Fix the input so a user can type continuously and naturally, then make Goals fully professional with full CRUD.

**Root cause to check (in order):**
1. A component (form/input) is **defined inside another component's render body**, so it remounts on every keystroke → input loses focus. Move all sub-components to module scope.
2. `key` on the input/list changing on each render, forcing React to remount the node.
3. Modal/parent re-rendering and re-mounting the form (e.g. an unstable `key`, or the modal content recreated each render).
4. A controlled `<Input>` whose `value` is transformed/reset on change.

**Current state.**
- `frontend/src/features/goals/components/GoalForm.tsx` — the create form (controlled `title` + `targetDate`, looks correct in isolation → inspect its **parent** `GoalsPage.tsx` and any Modal wrapper for the remount cause).
- `GoalCard.tsx`, `SubGoalList.tsx`, `ProgressBar.tsx`, `hooks/useGoals.ts`, `pages/GoalsPage.tsx`, `pages/GoalDetailPage.tsx`
- Backend: `backend/src/controllers/goalController.ts`

**Acceptance criteria.**
- [ ] A user can type a full goal title **without the field losing focus** and without characters being dropped — verified in a component test that types a multi-character string.
- [ ] Same fix applied to sub-goal inputs and any other place the pattern repeats.
- [ ] Goals full CRUD: create, edit (title, target date, progress, sub-goals), delete (with confirm).
- [ ] Progress reflects sub-goal completion; edits persist and re-render cleanly.

**Files to touch.** `features/goals/**`, `pages/GoalsPage.tsx`, `pages/GoalDetailPage.tsx`, backend goal controller if edit/delete missing. **Add a regression test** that types e.g. `"Learn Somali history"` into the goal field and asserts the full value.

---

## 3. Dashboard — group hub (Core / AI / Life / Growth) that reveals its features

**Goal.** The dashboard should present the four workspace groups — **Core, AI, Life, Growth** — as clickable cards/sections. When the user clicks a group, it **expands / navigates to show every feature inside that group** (as an in-page grid, not only the sidebar).

**Current state.**
- Sidebar already defines the exact grouping (`frontend/src/components/layout/Sidebar.tsx`):
  - **Core:** Dashboard, Planner, Tasks, Goals, Calendar, Habits, Notes, Focus Mode
  - **AI:** AI Coach, Reflection, Weekly Review, Analytics, Recommendations, Voice Assistant
  - **Life:** Health, Finance, Study, Career
  - **Growth:** Business, Automations, Achievements, Community
- `pages/DashboardPage.tsx` currently shows greeting, stat row, today's plan, coach, productivity chart — but **no group hub**.

**Acceptance criteria.**
- [ ] Extract the group + item definitions into a **single shared source** (e.g. `frontend/src/lib/navigation.ts`) that both `Sidebar.tsx` and the dashboard consume — one list, no duplication.
- [ ] Add a **"Explore" / group hub** section to the dashboard: four group cards (Core, AI, Life, Growth), each with its icon, label, and feature count.
- [ ] Clicking a group card **expands to reveal a grid of its features** (icon + name + one-line description), each linking to its route. Keyboard accessible, works on mobile.
- [ ] Keep the existing dashboard widgets above it; the hub is additive.

**Files to touch.** New `lib/navigation.ts`, `pages/DashboardPage.tsx`, refactor `components/layout/Sidebar.tsx` to consume the shared list, optional new `features/dashboard/components/GroupHub.tsx`.

---

## 4. Finance — professional money tracking (manual entry + prepared categories)

**Goal.** Make Finance genuinely professional. The user must be able to **manually record every expense from anywhere money left their hands**, typing a custom label, OR **pick from prepared categories** — and see clear summaries, budgets, and history.

**Current state.**
- `frontend/src/features/finance/` → `TransactionForm.tsx`, `TransactionFormModal.tsx`, `TransactionList.tsx`, `BudgetForm.tsx`, `hooks/useFinance.ts`
- `TransactionForm.tsx` today: type (Expense/Income), amount, a fixed `TransactionCategory` select, date. No free-text description, no custom category, no merchant/note.
- Shared: `TransactionCategory` enum in `@life-os/shared`. Backend: `backend/src/controllers/financeController.ts`.

**Acceptance criteria.**
- [ ] **Manual free entry:** add a required-optional **description/label** field ("Where did the money go?") and an optional **custom category** — user can type their own category name when the prepared ones don't fit.
- [ ] **Prepared categories:** keep the curated `TransactionCategory` list as quick-pick chips/select; selecting one fills the category, and the user can still override with a custom one.
- [ ] Fields per transaction: **type (income/expense), amount, currency, category (prepared OR custom), description, date, optional note/merchant, optional payment method.**
- [ ] **Full CRUD:** edit and delete any transaction (confirm on delete).
- [ ] **Summaries:** month total spent, total income, net, and a **spend-by-category breakdown** (list or chart). Respect the user's currency.
- [ ] **Budgets:** `BudgetForm` sets a budget per category; UI shows spent-vs-budget with a `ProgressBar` and an over-budget warning state.
- [ ] Validation via shared Zod schema; amount > 0; sensible empty/error/loading states.

**Files to touch.** `features/finance/**`, `packages/shared` (extend transaction schema: add `description`, `customCategory`/`categoryLabel`, `note`, `paymentMethod`, `currency`), `backend/src/controllers/financeController.ts` + route + repository + Prisma model/migration.

---

## 5. Professionalize every feature (Core / AI / Life / Growth)

**Goal.** Bring **every** feature to the same professional bar: real full CRUD where it applies, consistent design-system UI, loading/empty/error states, and no dead buttons. Do these **one feature per PR**, in this order.

For **each** feature below, the checklist is identical:
- [ ] Full CRUD (create / read / edit / delete) where the entity is user-owned, with confirm-on-delete.
- [ ] React Query hooks; optimistic where safe.
- [ ] `EmptyState` + error+Retry + `Skeleton` loading.
- [ ] Consistent `ui-kit` components + navy/amber theme.
- [ ] Shared Zod schema + typed API; backend route/controller/repository complete.
- [ ] Mobile + keyboard accessible; strings i18n-ready (en/so).
- [ ] No placeholder/stub UI — every visible control does something real.

**Core**
- **Tasks** (`features/tasks`, `taskController.ts`) — full CRUD, statuses, due dates, priority, filters.
- **Calendar** (`features/calendar`) — month/week view, create/edit/delete events, links to tasks.
- **Habits** (`features/habits`) — create/edit/delete habits, streaks, daily check-in, history.
- **Notes** (`features/notes`) — CRUD notes, search, tags/folders.
- **Focus Mode** (`features/focus`) — start/pause/stop timer, sessions persist, per-day totals feed the dashboard.

**AI**
- **AI Coach** (`features/coach`) — chat with real AI responses, history saved, bilingual (en/so) using existing `backend/src/ai`.
- **Reflection** (`features/reflection`) — daily reflection CRUD, prompts, mood.
- **Weekly Review** (`features/reviews`, `WeeklyReviewPage`) — generate & save weekly review, edit, history.
- **Analytics** (`features/analytics`) — real charts from real data (tasks, focus, habits, finance), date-range filter.
- **Recommendations** (`features/recommendations`) — AI recommendations list, accept/dismiss, acted-on state.
- **Voice Assistant** (`features/voice`) — record/transcribe, turn intents into actions, graceful fallback.

**Life**
- **Health** (`features/health`) — log metrics (sleep, water, weight, mood, exercise) CRUD, trends.
- **Finance** — see section 4 (do that fully first).
- **Study** (`features/study`) — subjects/courses, sessions, progress CRUD.
- **Career** (`features/career`) — goals, applications, milestones CRUD.

**Growth**
- **Business** (`features/business`) — projects/clients/revenue CRUD.
- **Automations** (`features/automations`) — rules (trigger → action) CRUD, enable/disable, run history.
- **Achievements** (`features/gamification`, `AchievementsPage`) — badges/points earned from real activity, progress to next.
- **Community** (`features/community`) — feed/groups, post CRUD, moderation-safe.

---

## Definition of Done (whole upgrade)

- All five sections above meet their acceptance criteria.
- `npm run lint` and `npm run build` green; existing tests pass; new regression test for the Goals typing bug added.
- No feature ships with a non-functional ("professional-looking but dead") control.
- Each feature is CRUD-complete, themed, accessible, and bilingual-ready.
- Dashboard group hub reveals every feature per group; Sidebar and hub read from one shared navigation source.
