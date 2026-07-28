-- Corrects MemoryItem.embedding from vector(1536) to vector(1024), matching Voyage AI's
-- voyage-3.5 default output dimension (verified live against the Voyage API).
-- No rows had embeddings populated yet, so this is a safe in-place type change.
ALTER TABLE "MemoryItem" ALTER COLUMN "embedding" TYPE vector(1024);
