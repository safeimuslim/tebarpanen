-- CreateTable
CREATE TABLE "WaterQualityLog" (
    "id" TEXT NOT NULL,
    "cultureCycleId" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "ph" DOUBLE PRECISION,
    "temperatureC" DOUBLE PRECISION,
    "doMgL" DOUBLE PRECISION,
    "ammoniaMgL" DOUBLE PRECISION,
    "waterColor" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterQualityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WaterQualityLog_cultureCycleId_idx" ON "WaterQualityLog"("cultureCycleId");

-- AddForeignKey
ALTER TABLE "WaterQualityLog"
ADD CONSTRAINT "WaterQualityLog_cultureCycleId_fkey"
FOREIGN KEY ("cultureCycleId") REFERENCES "CultureCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
