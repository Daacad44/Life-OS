# PRD — Finance Planner

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

The Finance Planner helps users manage income, expenses, savings, and budgets. It gives a clear picture of money in and out, and helps plan toward financial goals — directly useful for founders managing a lean budget.

---

## 2. Business Objective

- Give users clarity and control over their money.
- Connect financial goals to the Goal Engine.
- Help users budget and save intentionally.

---

## 3. User Stories

- As a user, I can record income and expenses.
- As a user, I can set a monthly budget by category.
- As a user, I can see how much I have left.
- As a user, I can track savings toward a goal.

---

## 4. UX Flow

1. User adds income and expense entries.
2. They assign categories and see a budget breakdown.
3. A summary shows income, spending, and remaining.
4. Savings progress ties to a financial goal.

---

## 5. UI Requirements

- Overview: income, expenses, remaining.
- Transaction list with categories.
- Budget-by-category view.
- Savings goal progress.
- Charts for spending trends.

---

## 6. AI Behavior

The AI reviews spending patterns, flags overspending, suggests a budget split (e.g. needs/savings/investment), and advises on reaching savings goals faster.

All AI runs through the AI Service Layer and only suggests — the user stays in control. See *03-Architecture / AI Architecture.md*.

---

## 7. Database

Stores `Transaction` (userId, type, amount, category, date) and `Budget` (userId, category, limit, period). Savings goals link to `Goal`.

See *03-Architecture / Database.md* for conventions (UUIDs, userId scoping, timestamps, soft deletes).

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | /finance/transactions | List transactions |
| POST | /finance/transactions | Add transaction |
| PATCH | /finance/transactions/:id | Edit |
| DELETE | /finance/transactions/:id | Delete |
| GET | /finance/budget | Budget overview |
| PATCH | /finance/budget | Set budget |

All endpoints are scoped to the authenticated user and follow the standard response envelope (*03-Architecture / API.md*).

---

## 9. Validation Rules

- `amount`: positive number.
- `type`: income or expense.
- `category`: from a defined set.
- User-scoped; financial data never logged.

---

## 10. Notifications

- Budget threshold reached.
- Monthly finance summary.
- Savings milestone.

---

## 11. Analytics

Track: spending by category, savings rate, budget adherence. Feeds *02-PRD / Life Analytics.md*.

---

## 12. Edge Cases

- Currency handling → store consistently, display user currency.
- Negative balance → clearly flagged.
- No data → onboarding empty state.
- Editing past months → allowed with care.

---

## 13. Acceptance Criteria

- [ ] User can CRUD transactions and set budgets.
- [ ] Overview computes income/expense/remaining.
- [ ] Savings ties to goals.
- [ ] Sensitive data handled securely.

---

## 14. Future Expansion

- Bank sync (open banking).
- Recurring transactions.
- Multi-currency.
- AI financial coaching.

---

## 15. Cross-References

- Goals → *02-PRD / Goal Engine.md*
- Security (sensitive data) → *03-Architecture / Security.md*
- Analytics → *02-PRD / Life Analytics.md*

---

*End of PRD — Finance Planner — v1.0*
