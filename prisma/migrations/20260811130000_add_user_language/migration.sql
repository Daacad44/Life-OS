-- AI response language preference: 'en' (default) or 'so' (Af-Soomaali).
-- Governs the language every AI feature replies in (see backend/src/ai/language.ts).
ALTER TABLE "User" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';
