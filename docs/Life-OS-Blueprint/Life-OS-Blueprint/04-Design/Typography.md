# Typography

**Version:** 1.0
**Part of:** Life OS Blueprint / 04-Design
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Typography Principles](#2-typography-principles)
3. [Font Family](#3-font-family)
4. [Type Scale](#4-type-scale)
5. [Font Weights](#5-font-weights)
6. [Line Height & Spacing](#6-line-height--spacing)
7. [Usage Rules](#7-usage-rules)
8. [Cross-References](#8-cross-references)

---

## 1. Purpose

This document defines the typography system for Life OS — the fonts, sizes, weights, and rules that keep text clean, readable, and consistent across the product.

---

## 2. Typography Principles

- **Readability first.** Text is the primary interface — it must be effortless to read.
- **Clear hierarchy.** Size and weight guide the eye; every screen has an obvious order.
- **Restraint.** A small, consistent scale — no random font sizes.

---

## 3. Font Family

| Role | Font |
|------|------|
| **UI / Body** | Inter (or a clean geometric sans-serif) |
| **Headings** | Same family, heavier weights |
| **Mono** | A monospace font for code/numbers where needed |

One primary typeface keeps the product cohesive. Inter is an excellent default for app UI.

---

## 4. Type Scale

A consistent scale (rem-based):

| Token | Size | Use |
|-------|------|-----|
| xs | 0.75rem (12px) | Captions, meta |
| sm | 0.875rem (14px) | Secondary text |
| base | 1rem (16px) | Body |
| lg | 1.125rem (18px) | Emphasized body |
| xl | 1.25rem (20px) | Small headings |
| 2xl | 1.5rem (24px) | Section headings |
| 3xl | 1.875rem (30px) | Page titles |
| 4xl | 2.25rem (36px) | Hero / large display |

---

## 5. Font Weights

| Weight | Use |
|--------|-----|
| 400 (Regular) | Body text |
| 500 (Medium) | Emphasis, labels |
| 600 (Semibold) | Headings, buttons |
| 700 (Bold) | Strong emphasis, large titles |

Avoid using more than these four weights.

---

## 6. Line Height & Spacing

- **Body:** line-height 1.5–1.6 for comfortable reading.
- **Headings:** tighter, 1.2–1.3.
- **Letter spacing:** default for body; slightly tighter for large headings.
- Generous paragraph spacing keeps text from feeling dense.

---

## 7. Usage Rules

1. **One page title per screen** (3xl), then section headings (2xl), then body.
2. **Never skip levels** arbitrarily — hierarchy should be logical.
3. **Muted text** (neutral-500) for secondary info, not lighter font sizes alone.
4. **No walls of text** — break content into scannable chunks.
5. **Numbers align** — use tabular figures for data/finance views.

---

## 8. Cross-References

- Design system → *04-Design / Design System.md*
- Colors → *04-Design / Colors.md*
- Components → *04-Design / Components.md*

---

*End of Typography — v1.0*
