# UI Notes — `Life_OS_dc.html` → React

Maps the approved prototype (`Life_OS_dc.html`) to the components built from it.
Updated at the end of each build step.

## Surfaces extracted from the prototype

| Surface     | Prototype gate                    | Background                            | Screens                                                                                                           |
| ----------- | --------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Landing** | `<sc-if value="{{ isLanding }}">` | Navy `#0B1F3A`                        | Sticky nav, hero, feature tiles (6), pricing (Free / Pro / Premium), CTA band, footer                             |
| **Auth**    | `<sc-if value="{{ isAuth }}">`    | Radial navy `#13315C → #0B1F3A`       | Login, Sign Up, Forgot Password (`authMode: login \| signup \| forgot`); Verify Email follows the same card       |
| **App**     | `<sc-if value="{{ isApp }}">`     | Canvas `#F8FAFC` + fixed navy sidebar | Dashboard, Tasks, Goals, Calendar, Habits, AI Coach, Analytics, Finance, Focus Mode, Notifications, Settings (11) |

The prototype's "how it works" content ships as the CTA band + feature grid; there is
no separate numbered-steps section in the HTML, so `HowItWorks` is built from the
feature/CTA copy already present rather than invented.

## Step 1 — tokens and shared atoms

### Tokens — `src/index.css`

The repo is on **Tailwind v4**, which is CSS-first: there is no `tailwind.config.js`,
so the palette lives in an `@theme` block. Prototype hexes are set explicitly (Tailwind
v4's stock palette is oklch and would land a shade off `#F59E0B` / `#0F172A`).

| Token group | Tokens                                                                                                  | Prototype source                                     |
| ----------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Navy        | `navy-950 #081627`, `navy-900 #0B1F3A`, `navy-800 #13315C`, `navy-700 #1D4E89`, `navy-50 #e0edff`       | Footer, deep surface, raised, active nav, tint       |
| Amber       | `amber-100 #FEF3C7`, `amber-400 #FBBF24`, `amber-500 #F59E0B`, `amber-600 #D97706`, `amber-700 #B45309` | Accent, CTA, hover, tag text                         |
| Neutrals    | `slate-50 … slate-900`                                                                                  | Canvas `#F8FAFC`, hairline `#E2E8F0`, body `#0F172A` |
| Accents     | `accent-emerald`, `accent-violet`, `accent-red` (+ tints), `accent-red-bright`, `accent-green-bright`   | Goals, stat chips, charts, tags                      |
| Type        | `--font-display` → Plus Jakarta Sans Variable                                                           | `font-family` on every surface                       |

Also global: prototype scrollbar styling and the `prefers-reduced-motion` rule.
Tabular figures use Tailwind's `tabular-nums` (the prototype's `.tnum`).

The `--font-display` token names Plus Jakarta Sans; it is loaded from Google Fonts in
`index.html` (as the prototype did), so the prototype surfaces render in the right face
with no npm/webfont weight added to the bundle.

### Atoms — `src/components/ui-kit/`

| Component     | Prototype patterns it replaces                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`      | `primary` (amber CTA), `navy` (Add Task / New Goal), `outline` + `ghost` (dark surfaces), `surface` (topbar chrome), `link` (Add subtask, Mark all as read) |
| `Card`        | `surface` (white in-app card), `navy` (AI Coach, hero mock, Go Pro), `glass` (marketing/auth tiles)                                                         |
| `CardTitle`   | The 16px/800 heading opening each in-app card                                                                                                               |
| `StatCard`    | Dashboard stat row, Analytics stat row (with delta), Finance stat row (coloured value)                                                                      |
| `Badge`       | Priority pill, tags, due chip, "Popular" flag, hero eyebrow                                                                                                 |
| `ProgressBar` | Goal progress track                                                                                                                                         |
| `Avatar`      | Topbar initials chip (square, 38px), Settings avatar (circle, 72px)                                                                                         |
| `Input`       | Auth fields (`tone="dark"`), Settings fields (`tone="light"`), with `endAdornment` for the password toggle                                                  |
| `Tabs`        | Segmented control on Tasks, Goals, Habits, Calendar, Notifications, Settings                                                                                |
| `Modal`       | Create/edit dialogs on the prototype's scrim (`slate-900/50`, same as the mobile sidebar scrim)                                                             |
| `EmptyState`  | Zero-data state for every list view                                                                                                                         |
| `Logo`        | The amber "L" mark + wordmark repeated in nav, auth, sidebar, and footer                                                                                    |
| `tones.ts`    | The tint/foreground pairs behind every coloured icon chip, bar, and value                                                                                   |

Accessibility carried by the atoms: `focus-visible` outlines on every control, 44px
minimum hit area on coarse pointers (`pointer-coarse:min-h-11`, so desktop spacing stays
pixel-exact), roving-tabindex arrow-key navigation in `Tabs`, focus trap + Escape +
focus restore in `Modal`, `role="progressbar"` with clamped `aria-valuenow`.

## Deviations from the build brief (and why)

- **React 19, not 18** — the repo already runs React 19.2; downgrading would break the
  existing app. Atoms use React 19's ref-as-prop instead of `forwardRef`.
- **No `tailwind.config`** — Tailwind v4 is CSS-first; the equivalent config is the
  `@theme` block in `src/index.css`.
- **`--font-display` rather than replacing `--font-sans`** — the pre-existing app pages
  still render in Inter. New surfaces opt into Plus Jakarta Sans with `font-display`.
  Once the prototype UI replaces those pages, `--font-sans` can point at it globally.
- **New atoms live in `components/ui-kit/`**, alongside the older `components/ui/`
  shadcn primitives, which stay in place for the existing pages.

## Marketing, auth, shell, and screens

Built on top of the atoms and wired into the router.

| Surface / screen        | Components / files                                                                                                                                             | Route                                   |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Landing                 | `features/marketing/` → `MarketingNav`, `Hero`, `Features`, `Pricing`, `Footer`, assembled in `pages/LandingPage.tsx`; copy in `features/marketing/data.ts`    | `/welcome`                              |
| Login / Signup / Forgot | `pages/LoginPage`, `pages/SignupPage`, `pages/ForgotPasswordPage`                                                                                              | `/login`, `/signup`, `/forgot-password` |
| App shell               | `components/layout/AppShell` (navy sidebar + scrim drawer), `Sidebar` (11-item nav, amber rail, Go Pro), `TopBar` (title, search, bell, theme, avatar, logout) | wraps the routes below                  |
| Dashboard               | `pages/DashboardPage`                                                                                                                                          | `/`                                     |
| Tasks                   | `pages/TasksPage` (Today/Upcoming/Completed tabs, detail panel)                                                                                                | `/tasks`                                |
| Goals                   | `pages/GoalsPage`                                                                                                                                              | `/goals`                                |
| Calendar                | `pages/CalendarPage` (May 2026 month grid)                                                                                                                     | `/calendar`                             |
| Habits                  | `pages/HabitsPage` (streaks, check-off)                                                                                                                        | `/habits`                               |
| AI Coach                | `pages/CoachPage` (chat, quick chips)                                                                                                                          | `/coach`                                |
| Analytics               | `pages/AnalyticsPage` (line + donut)                                                                                                                           | `/analytics`                            |
| Finance                 | `pages/FinancePage` (donut + transactions)                                                                                                                     | `/finance`                              |
| Focus Mode              | `pages/FocusPage` (countdown ring)                                                                                                                             | `/focus`                                |
| Notifications           | `pages/NotificationsPage` (filters, mark-all-read)                                                                                                             | `/notifications`                        |
| Settings                | `pages/SettingsPage` (profile form)                                                                                                                            | `/settings`                             |

### Routing notes

- The landing page lives at **`/welcome`** because `/` is the authenticated Dashboard
  behind `ProtectedRoute`. Point the site root at `LandingPage` for logged-out visitors
  when the auth flow is reworked.
- The prototype defines **11 nav items**; the sidebar now shows exactly those. The
  repo's other feature pages (Planner, Notes, Health, Study, …) keep their routes and
  are reachable by URL, but are no longer in the nav — the prototype is the source of
  truth for navigation.

## Where mock data will become API calls

Every rebuilt app screen renders from a typed mock block at the top of its page file,
marked `// MOCK — replace with useX()`. Auth pages already run the real `useLogin` /
`useSignup` flows; only their markup changed. Swap points, screen by screen:

| Screen          | Replace mock with                                            |
| --------------- | ------------------------------------------------------------ |
| Dashboard       | `useDashboard()` (stats, today's plan) + `useTasks()`        |
| Tasks           | `useTasks()` (list, toggle, detail, subtasks)                |
| Goals           | `useGoals()`                                                 |
| Calendar        | `useCalendar()` (events by day)                              |
| Habits          | `useHabits()` (streaks, check-off mutation)                  |
| AI Coach        | `useCoach()` (message history + send)                        |
| Analytics       | `useAnalytics()` (series + priority split)                   |
| Finance         | `useFinance()` (totals, breakdown, transactions)             |
| Focus           | `useFocus()` (session persistence)                           |
| Notifications   | `useNotifications()` (list, mark-all-read)                   |
| Settings        | `useUpdateProfile()` (already exists in `useAuth`)           |
| Forgot Password | real reset-request endpoint (currently a local confirmation) |
