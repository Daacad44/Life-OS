# Color System

**Version:** 1.0
**Part of:** Life OS Blueprint / 04-Design
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Color Philosophy](#2-color-philosophy)
3. [Brand Colors](#3-brand-colors)
4. [Semantic Colors](#4-semantic-colors)
5. [Neutral Scale](#5-neutral-scale)
6. [Light Theme](#6-light-theme)
7. [Dark Theme](#7-dark-theme)
8. [Accessibility](#8-accessibility)
9. [Cross-References](#9-cross-references)

---

## 1. Purpose

This document defines the Life OS color palette as reusable tokens for both light and dark themes. Colors are implemented as CSS variables / Tailwind tokens so themes swap cleanly.

---

## 2. Color Philosophy

- **Calm and focused** — a restrained palette, not a rainbow.
- **One confident accent** — a single brand color carries identity.
- **Neutrals do the heavy lifting** — most of the UI is neutral; color highlights meaning.
- **Meaning is consistent** — success is always green, danger always red.

---

## 3. Brand Colors

| Token | Role |
|-------|------|
| `--primary` | Main brand accent (buttons, active states, focus) |
| `--primary-foreground` | Text/icon on primary |
| `--primary-muted` | Soft tints of primary (backgrounds, highlights) |

> Choose one confident accent (e.g. a deep indigo or teal) as `--primary`. Everything keys off it.

---

## 4. Semantic Colors

| Token | Meaning |
|-------|---------|
| `--success` | Completed, positive |
| `--warning` | Caution, attention |
| `--danger` | Errors, destructive actions |
| `--info` | Neutral information |

Each has a `-foreground` and a `-muted` variant.

---

## 5. Neutral Scale

A neutral gray scale powers most of the UI:

```
neutral-50   (lightest — backgrounds)
neutral-100
neutral-200  (borders, dividers)
neutral-300
neutral-400  (muted text)
neutral-500
neutral-600  (secondary text)
neutral-700
neutral-800
neutral-900  (primary text)
neutral-950  (darkest)
```

---

## 6. Light Theme

| Token | Value role |
|-------|-----------|
| `--background` | neutral-50 |
| `--surface` | white |
| `--border` | neutral-200 |
| `--text` | neutral-900 |
| `--text-muted` | neutral-500 |

Clean, bright, spacious.

---

## 7. Dark Theme

| Token | Value role |
|-------|-----------|
| `--background` | neutral-950 |
| `--surface` | neutral-900 |
| `--border` | neutral-800 |
| `--text` | neutral-50 |
| `--text-muted` | neutral-400 |

Dark mode is tuned for comfort — soft, not pure black, to reduce eye strain.

---

## 8. Accessibility

- Text meets **WCAG AA** contrast (4.5:1 for body text).
- The primary accent has a foreground that passes contrast on it.
- Color is never the *only* signal — icons/labels reinforce meaning.
- Both themes tested for contrast.

---

## 9. Cross-References

- Design system → *04-Design / Design System.md*
- Typography → *04-Design / Typography.md*
- Components → *04-Design / Components.md*

---

*End of Color System — v1.0*
