-- AlterTable
ALTER TABLE "CultureCycle"
ADD COLUMN "seedPriceTotal" DECIMAL(14,2);

-- Ensure one pond can only belong to one active cycle at a time.
CREATE UNIQUE INDEX "CultureCycle_active_pond_unique"
ON "CultureCycle"("pondId")
WHERE "status" = 'ACTIVE';
