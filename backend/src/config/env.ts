import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  SESSION_SECRET: z.string().min(1).default('dev-secret-change-me'),
  // AI provider (Google Gemini) — server-side only, never exposed to the frontend.
  GEMINI_API_KEY: z.string().optional(),
  // Main chat/completions model. Flash generation: fast, cost-effective, strong at
  // agentic/planning work (AI Coach + feature reasoning). Override to a Pro-tier model
  // for deeper reasoning without a code change.
  GEMINI_MODEL: z.string().default('gemini-3.6-flash'),
  // Embedding model for AI memory. gemini-embedding-001 is the GA, free-tier text
  // embedding model; it supports output dims of 3072/1536/768 — we request 1536 via
  // GEMINI_EMBEDDING_DIM. (gemini-embedding-2 exists only as a *-preview id.)
  GEMINI_EMBEDDING_MODEL: z.string().default('gemini-embedding-001'),
  // Must match MemoryItem.embedding's vector() width in prisma/schema.prisma.
  GEMINI_EMBEDDING_DIM: z.coerce.number().default(1536),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .optional(),
})

export const env = envSchema.parse(process.env)
