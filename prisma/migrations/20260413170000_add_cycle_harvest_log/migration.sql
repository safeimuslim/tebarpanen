-- CreateTable
CREATE TABLE "HarvestLog" (
  "id" TEXT NOT NULL,
  "cultureCycleId" TEXT NOT NULL,
  "logDate" TIMESTAMP(3) NOT NULL,
  "totalWeightKg" DOUBLE PRECISION NOT NULL,
  "harvestedCount" INTEGER NOT NULL,
  "pricePerKg" DECIMAL(12,2) NOT NULL,
  "buyer" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HarvestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HarvestLog_cultureCycleId_idx" ON "HarvestLog"("cultureCycleId");

-- AddForeignKey
ALTER TABLE "HarvestLog"
ADD CONSTRAINT "HarvestLog_cultureCycleId_fkey"
FOREIGN KEY ("cultureCycleId")
REFERENCES "CultureCycle"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
