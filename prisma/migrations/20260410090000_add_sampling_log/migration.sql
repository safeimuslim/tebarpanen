-- CreateTable
CREATE TABLE "SamplingLog" (
    "id" TEXT NOT NULL,
    "cultureCycleId" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "sampleCount" INTEGER NOT NULL,
    "averageWeightG" DOUBLE PRECISION,
    "averageLengthCm" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SamplingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SamplingLog_cultureCycleId_idx" ON "SamplingLog"("cultureCycleId");

-- AddForeignKey
ALTER TABLE "SamplingLog"
ADD CONSTRAINT "SamplingLog_cultureCycleId_fkey"
FOREIGN KEY ("cultureCycleId") REFERENCES "CultureCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
