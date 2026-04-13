-- CreateTable
CREATE TABLE "TreatmentLog" (
    "id" TEXT NOT NULL,
    "cultureCycleId" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "productName" TEXT NOT NULL,
    "dosage" TEXT,
    "purpose" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TreatmentLog_cultureCycleId_idx" ON "TreatmentLog"("cultureCycleId");

-- AddForeignKey
ALTER TABLE "TreatmentLog"
ADD CONSTRAINT "TreatmentLog_cultureCycleId_fkey"
FOREIGN KEY ("cultureCycleId") REFERENCES "CultureCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
