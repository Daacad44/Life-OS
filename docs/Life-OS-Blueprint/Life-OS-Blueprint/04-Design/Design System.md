# Design System

**Version:** 1.0
**Part of:** Life OS Blueprint / 04-Design
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Design Principles](#2-design-principles)
3. [Foundations](#3-foundations)
4. [Spacing System](#4-spacing-system)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Border Radius](#6-border-radius)
7. [Motion](#7-motion)
8. [Theming (Light/Dark)](#8-theming-lightdark)
9. [Cross-References](#9-cross-references)

---

## 1. Purpose

This document defines the visual language of Life OS — the shared foundations (spacing, elevation, radius, motion, theming) that keep 25 features looking like one product. Colors and typography have their own documents.

---

## 2. Design Principles

1. **Calm, not cluttered.** Life OS holds a lot; the UI must feel spacious and focused.
2. **Clarity first.** Every screen has one obvious primary action.
3. **Consistent, not clever.** Reuse patterns; avoid one-off designs.
4. **Content over chrome.** The user's life is the star, not the interface.
5. **Accessible by default.** Contrast, focus states, and keyboard support are required.

---

## 3. Foundations

Life OS is built on **Tailwind CSS + shadcn/ui**. The design system is expressed as design tokens (Tailwind theme values), so every value is reusable and consistent.

Token categories:
- Color (see *Colors.md*)
- Typography (see *Typography.md*)
- Spacing
- Radius
- Shadow
- Motion

---

## 4. Spacing System

Based on a **4px scale**:

| Token | Value | Use |
|-------|-------|-----|
| xs | 4px | Tight gaps |
| sm | 8px | Inside small components |
| md | 16px | Default gap |
| lg | 24px | Section spacing |
| xl | 32px | Between blocks |
| 2xl | 48px | Page sections |

Consistent spacing is the single biggest driver of a "clean" feel.

---

## 5. Elevation & Shadows

A small, deliberate set of elevations:

| Level | Use |
|-------|-----|
| 0 | Flat (background) |
| 1 | Cards |
| 2 | Dropdowns, popovers |
| 3 | Modals, dialogs |

Shadows are soft and subtle — never heavy.

---

## 6. Border Radius

| Token | Value | Use |
|-------|-------|-----|
| sm | 6px | Inputs, small elements |
| md | 10px | Cards, buttons |
| lg | 16px | Panels, modals |
| full | 9999px | Pills, avatars |

Rounded but not bubbly — a modern, professional feel.

---

## 7. Motion

- **Fast and subtle.** 150–250ms for most transitions.
- Ease-out for entrances, ease-in for exits.
- Motion communicates state changes; it never blocks or distracts.
- Respect `prefers-reduced-motion`.

---

## 8. Theming (Light/Dark)

- Both light and dark modes are first-class.
- All colors are defined as CSS variables / Tailwind tokens so themes swap cleanly.
- Dark mode is not just inverted — it's tuned for comfort (see *Colors.md*).
- Theme preference is stored per user.

---

## 9. Cross-References

- Colors → *04-Design / Colors.md*
- Typography → *04-Design / Typography.md*
- Components → *04-Design / Components.md*
- UX → *04-Design / UX.md*
- Frontend implementation → *03-Architecture / Frontend.md*

---

*End of Design System — v1.0*
