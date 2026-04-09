-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('WATER_QUALITY_METER', 'SCALE', 'HARVEST_EQUIPMENT', 'FEED_EQUIPMENT', 'AERATION_OXYGEN', 'PUMP_CIRCULATION', 'CONTAINER_STORAGE', 'CLEANING_EQUIPMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "EquipmentCondition" AS ENUM ('READY', 'NEEDS_CHECK', 'BROKEN');

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "brand" TEXT,
    "serialNumber" TEXT,
    "calibrationDate" TIMESTAMP(3),
    "condition" "EquipmentCondition" NOT NULL DEFAULT 'READY',
    "purchasePrice" DECIMAL(14,2),
    "purchasedAt" TIMESTAMP(3),
    "depreciationMonths" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);
