-- CreateEnum
CREATE TYPE "HarvestPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');

-- CreateEnum
CREATE TYPE "HarvestPaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'E_WALLET', 'OTHER');

-- CreateTable
CREATE TABLE "HarvestTransaction" (
  "id" TEXT NOT NULL,
  "cultureCycleId" TEXT NOT NULL,
  "invoiceNumber" TEXT NOT NULL,
  "harvestDate" TIMESTAMP(3) NOT NULL,
  "totalWeightKg" DOUBLE PRECISION NOT NULL,
  "harvestedCount" INTEGER NOT NULL,
  "buyerName" TEXT NOT NULL,
  "pricePerKg" DECIMAL(12,2) NOT NULL,
  "grossAmount" DECIMAL(14,2) NOT NULL,
  "dueDate" TIMESTAMP(3),
  "paymentStatus" "HarvestPaymentStatus" NOT NULL DEFAULT 'PAID',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HarvestTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestPayment" (
  "id" TEXT NOT NULL,
  "harvestTransactionId" TEXT NOT NULL,
  "paymentDate" TIMESTAMP(3) NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "method" "HarvestPaymentMethod",
  "referenceNumber" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HarvestPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HarvestTransaction_invoiceNumber_key" ON "HarvestTransaction"("invoiceNumber");

-- CreateIndex
CREATE INDEX "HarvestTransaction_cultureCycleId_idx" ON "HarvestTransaction"("cultureCycleId");

-- CreateIndex
CREATE INDEX "HarvestTransaction_harvestDate_idx" ON "HarvestTransaction"("harvestDate");

-- CreateIndex
CREATE INDEX "HarvestTransaction_paymentStatus_idx" ON "HarvestTransaction"("paymentStatus");

-- CreateIndex
CREATE INDEX "HarvestPayment_harvestTransactionId_idx" ON "HarvestPayment"("harvestTransactionId");

-- CreateIndex
CREATE INDEX "HarvestPayment_paymentDate_idx" ON "HarvestPayment"("paymentDate");

-- Backfill old harvest logs as direct harvest transactions.
INSERT INTO "HarvestTransaction" (
  "id",
  "cultureCycleId",
  "invoiceNumber",
  "harvestDate",
  "totalWeightKg",
  "harvestedCount",
  "buyerName",
  "pricePerKg",
  "grossAmount",
  "paymentStatus",
  "notes",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "cultureCycleId",
  CONCAT('TRX-PN-', UPPER(SUBSTRING("id" FROM 1 FOR 8))),
  "logDate",
  "totalWeightKg",
  "harvestedCount",
  COALESCE(NULLIF("buyer", ''), 'Pembeli Umum'),
  "pricePerKg",
  ROUND(("totalWeightKg"::numeric * "pricePerKg"), 2),
  'PAID'::"HarvestPaymentStatus",
  "notes",
  "createdAt",
  "updatedAt"
FROM "HarvestLog";

-- Preserve historical transactions as paid immediately on the harvest date.
INSERT INTO "HarvestPayment" (
  "id",
  "harvestTransactionId",
  "paymentDate",
  "amount",
  "method",
  "notes",
  "createdAt",
  "updatedAt"
)
SELECT
  CONCAT("id", '_payment'),
  "id",
  "logDate",
  ROUND(("totalWeightKg"::numeric * "pricePerKg"), 2),
  'OTHER'::"HarvestPaymentMethod",
  'Migrated from HarvestLog',
  "createdAt",
  "updatedAt"
FROM "HarvestLog";

-- AddForeignKey
ALTER TABLE "HarvestTransaction"
ADD CONSTRAINT "HarvestTransaction_cultureCycleId_fkey"
FOREIGN KEY ("cultureCycleId")
REFERENCES "CultureCycle"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestPayment"
ADD CONSTRAINT "HarvestPayment_harvestTransactionId_fkey"
FOREIGN KEY ("harvestTransactionId")
REFERENCES "HarvestTransaction"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Drop old table after data migration.
DROP TABLE "HarvestLog";
