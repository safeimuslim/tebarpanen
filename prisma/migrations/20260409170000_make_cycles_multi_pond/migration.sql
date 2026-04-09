-- CreateTable
CREATE TABLE "CyclePond" (
    "cycleId" TEXT NOT NULL,
    "pondId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CyclePond_pkey" PRIMARY KEY ("cycleId","pondId")
);

-- Backfill existing single-pond cycles into join table.
INSERT INTO "CyclePond" ("cycleId", "pondId", "isActive", "createdAt")
SELECT
  "id",
  "pondId",
  CASE WHEN "status" = 'ACTIVE' THEN true ELSE false END,
  "createdAt"
FROM "CultureCycle"
WHERE "pondId" IS NOT NULL
ON CONFLICT ("cycleId", "pondId") DO NOTHING;

-- Drop the old single-pond uniqueness rule.
DROP INDEX IF EXISTS "CultureCycle_active_pond_unique";

-- CreateIndex
CREATE INDEX "CyclePond_pondId_idx" ON "CyclePond"("pondId");

-- Ensure a pond can only belong to one active cycle at a time.
CREATE UNIQUE INDEX "CyclePond_active_pond_unique"
ON "CyclePond"("pondId")
WHERE "isActive" = true;

-- AddForeignKey
ALTER TABLE "CyclePond"
ADD CONSTRAINT "CyclePond_cycleId_fkey"
FOREIGN KEY ("cycleId") REFERENCES "CultureCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CyclePond"
ADD CONSTRAINT "CyclePond_pondId_fkey"
FOREIGN KEY ("pondId") REFERENCES "Pond"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop old single-pond relation from CultureCycle.
ALTER TABLE "CultureCycle" DROP CONSTRAINT IF EXISTS "CultureCycle_pondId_fkey";
ALTER TABLE "CultureCycle" DROP COLUMN IF EXISTS "pondId";
