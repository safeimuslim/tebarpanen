-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM (
  'SEED',
  'FEED',
  'MEDICINE_VITAMIN',
  'LABOR',
  'ELECTRICITY',
  'OTHER'
);

-- CreateTable
CREATE TABLE "ExpenseLog" (
  "id" TEXT NOT NULL,
  "cultureCycleId" TEXT NOT NULL,
  "logDate" TIMESTAMP(3) NOT NULL,
  "category" "ExpenseCategory" NOT NULL,
  "title" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ExpenseLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExpenseLog_cultureCycleId_idx" ON "ExpenseLog"("cultureCycleId");

-- AddForeignKey
ALTER TABLE "ExpenseLog"
ADD CONSTRAINT "ExpenseLog_cultureCycleId_fkey"
FOREIGN KEY ("cultureCycleId")
REFERENCES "CultureCycle"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
