-- AI provider migration: embeddings moved from Voyage AI (voyage-3.5, 1024-dim) to the
-- Gemini embedding model (gemini-embedding-001) with a 1536-dim requested output.
--
-- The old 1024-dim vectors are meaningless under the new model AND pgvector rejects an
-- in-place type change when existing vectors don't match the new width, so clear them
-- first. Affected rows must be re-embedded (memories are re-generated from their source
-- records / conversation; see CHANGES.md "Follow-ups"). Content is preserved.
UPDATE "MemoryItem" SET "embedding" = NULL WHERE "embedding" IS NOT NULL;

ALTER TABLE "MemoryItem" ALTER COLUMN "embedding" TYPE vector(1536);
