# Component Library

**Version:** 1.0
**Part of:** Life OS Blueprint / 04-Design
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Foundation](#2-foundation)
3. [Primitive Components](#3-primitive-components)
4. [Composite Components](#4-composite-components)
5. [Layout Components](#5-layout-components)
6. [Feature Components](#6-feature-components)
7. [Component Rules](#7-component-rules)
8. [Cross-References](#8-cross-references)

---

## 1. Purpose

This document catalogs the components Life OS is built from. A shared component library keeps 25 features visually and behaviorally consistent, and keeps AI coding assistants reusing parts instead of reinventing them.

---

## 2. Foundation

- Base primitives come from **shadcn/ui** (built on Radix + Tailwind).
- Shared composites are built once and reused everywhere.
- Feature-specific components live inside their feature folder.

---

## 3. Primitive Components

From shadcn/ui, styled with the design tokens:

- Button (primary, secondary, ghost, destructive)
- Input, Textarea, Select, Checkbox, Switch, Radio
- Dialog / Modal
- Dropdown Menu
- Popover, Tooltip
- Tabs
- Toast / Notification
- Avatar
- Badge
- Card
- Skeleton (loading)

---

## 4. Composite Components

Built from primitives, reused across features:

| Component | Purpose |
|-----------|---------|
| **PageHeader** | Title + actions at the top of a page |
| **EmptyState** | Friendly prompt when there's no data |
| **DataList** | List with loading/empty/error handling |
| **ConfirmDialog** | Reusable destructive-action confirm |
| **QuickAdd** | Global add-anything input |
| **StatCard** | A single metric on the dashboard |
| **FilterBar** | Filtering/sorting controls |
| **AIChatPanel** | The AI coach interface |

---

## 5. Layout Components

| Component | Purpose |
|-----------|---------|
| **AppShell** | Sidebar + top bar + content area |
| **Sidebar** | Primary navigation |
| **TopBar** | Search, quick-add, notifications, profile |
| **PageContainer** | Consistent page padding/width |
| **Grid** | Dashboard widget grid |

---

## 6. Feature Components

Each feature contributes its own components (in its feature folder), for example:

- Tasks: `TaskItem`, `TaskList`, `TaskForm`
- Goals: `GoalCard`, `GoalProgress`, `SubGoalList`
- Habits: `HabitRow`, `StreakBadge`, `CheckinButton`
- Calendar: `CalendarView`, `EventForm`
- Dashboard: `DashboardWidget`

These follow the same tokens and primitives as everything else.

---

## 7. Component Rules

1. **Reuse before building.** Check this catalog first.
2. **Props are typed.** Every component has a TypeScript interface.
3. **Presentational where possible.** Logic lives in hooks, not components.
4. **Every state handled.** Loading, empty, error, disabled.
5. **Accessible.** Labels, focus, keyboard support.
6. **Themed via tokens.** No hardcoded colors or spacing.

---

## 8. Cross-References

- Design system → *04-Design / Design System.md*
- Colors → *04-Design / Colors.md*
- Typography → *04-Design / Typography.md*
- Frontend structure → *03-Architecture / Frontend.md*

---

*End of Component Library — v1.0*
