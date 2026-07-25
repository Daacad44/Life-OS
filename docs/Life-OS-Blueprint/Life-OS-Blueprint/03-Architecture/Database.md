# Database Architecture

**Version:** 1.0
**Part of:** Life OS Blueprint / 03-Architecture
**Status:** Foundation
**Last Updated:** July 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Database Choice](#2-database-choice)
3. [Design Principles](#3-design-principles)
4. [Core Entities](#4-core-entities)
5. [Entity Relationships](#5-entity-relationships)
6. [Core Prisma Schema (Foundation)](#6-core-prisma-schema-foundation)
7. [AI Memory & Vectors](#7-ai-memory--vectors)
8. [Migrations Strategy](#8-migrations-strategy)
9. [Indexing & Performance](#9-indexing--performance)
10. [Cross-References](#10-cross-references)

---

## 1. Purpose

This document defines the Life OS data model: the database engine, the core entities, their relationships, and the foundational Prisma schema that later features extend. It is the single source of truth for how data is structured.

---

## 2. Database Choice

- **PostgreSQL** — relational, reliable, mature, and well supported.
- **pgvector extension** — stores embeddings for AI memory and semantic search inside the same database, avoiding a separate vector DB.
- **Prisma** — type-safe schema, migrations, and queries.

One database serves both relational data and AI vectors, which keeps the stack simple for a solo founder.

---

## 3. Design Principles

1. **Every record belongs to a user** — nearly all tables have a `userId` foreign key (multi-tenant by user).
2. **UUID primary keys** — safer to expose than sequential integers.
3. **Timestamps everywhere** — `createdAt` and `updatedAt` on every table.
4. **Soft deletes where needed** — a `deletedAt` field instead of hard deletes for user data.
5. **Enums for fixed sets** — status, priority, frequency, etc.
6. **No business logic in the DB** — logic lives in the service layer.

---

## 4. Core Entities

The foundation entities most features depend on:

| Entity | Description |
|--------|-------------|
| **User** | Account, profile, preferences |
| **Task** | A to-do item |
| **Goal** | A goal with sub-goals and progress |
| **Habit** | A recurring habit + check-ins |
| **CalendarEvent** | A scheduled event |
| **Note** | Second-brain note/document |
| **MemoryItem** | AI memory entry (with vector embedding) |
| **Notification** | A user notification |

Feature-specific tables (finance, health, study, etc.) are defined in their own PRDs but follow the same conventions.

---

## 5. Entity Relationships

```
User (1) ───< Task
User (1) ───< Goal ───< SubGoal
User (1) ───< Habit ───< HabitCheckin
User (1) ───< CalendarEvent
User (1) ───< Note
User (1) ───< MemoryItem
User (1) ───< Notification

Task (0..1) >─── Goal        (a task can belong to a goal)
CalendarEvent (0..1) >─── Task (an event can link to a task)
```

---

## 6. Core Prisma Schema (Foundation)

This is the foundational schema. Each feature PRD adds its own models following the same style.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [vector]
}

model User {
  id          String   @id @default(uuid())
  email       String   @unique
  name        String?
  passwordHash String?
  timezone    String   @default("UTC")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tasks       Task[]
  goals       Goal[]
  habits      Habit[]
  events      CalendarEvent[]
  notes       Note[]
  memories    MemoryItem[]
  notifications Notification[]
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

model Task {
  id          String     @id @default(uuid())
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  goalId      String?
  goal        Goal?      @relation(fields: [goalId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?

  @@index([userId])
  @@index([status])
}

model Goal {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  description String?
  progress    Int      @default(0)
  targetDate  DateTime?
  tasks       Task[]
  subGoals    SubGoal[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([userId])
}

model SubGoal {
  id        String   @id @default(uuid())
  goalId    String
  goal      Goal     @relation(fields: [goalId], references: [id])
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum HabitFrequency {
  DAILY
  WEEKLY
}

model Habit {
  id         String         @id @default(uuid())
  userId     String
  user       User           @relation(fields: [userId], references: [id])
  title      String
  frequency  HabitFrequency @default(DAILY)
  streak     Int            @default(0)
  checkins   HabitCheckin[]
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  @@index([userId])
}

model HabitCheckin {
  id        String   @id @default(uuid())
  habitId   String
  habit     Habit    @relation(fields: [habitId], references: [id])
  date      DateTime @default(now())
  done      Boolean  @default(true)
}

model CalendarEvent {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  startTime DateTime
  endTime   DateTime
  taskId    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model Note {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([userId])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  body      String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
}
```

---

## 7. AI Memory & Vectors

AI memory uses pgvector. The `MemoryItem` model stores both the text and its embedding:

```prisma
model MemoryItem {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  type      String   // fact, preference, event, summary
  embedding Unsupported("vector(1536)")?
  createdAt DateTime @default(now())

  @@index([userId])
}
```

Semantic search runs a vector similarity query (cosine distance) against `embedding`, filtered by `userId`. See *AI Architecture.md*.

---

## 8. Migrations Strategy

- All schema changes go through **Prisma Migrate**.
- Every migration is committed to git.
- Never edit the database manually — schema is the source of truth.
- Feature branches include their migrations; they merge with the feature.

---

## 9. Indexing & Performance

- Index every `userId` foreign key (the most common filter).
- Index frequently queried fields (`status`, `dueDate`, `date`).
- Add composite indexes as real queries demand them.
- Use the vector index (ivfflat/hnsw) on `embedding` for fast semantic search.

---

## 10. Cross-References

- Overall system → *03-Architecture / System Architecture.md*
- Backend → *03-Architecture / Backend.md*
- AI memory → *03-Architecture / AI Architecture.md*
- Individual feature schemas → *02-PRD / (each feature).md*

---

*End of Database Architecture — v1.0*
