-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardedAt" TIMESTAMP(3);

-- Existing accounts predate the onboarding wizard — treat them as already
-- onboarded so it only appears for genuinely new signups going forward.
UPDATE "User" SET "onboardedAt" = "createdAt" WHERE "onboardedAt" IS NULL;
