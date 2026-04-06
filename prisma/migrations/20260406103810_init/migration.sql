-- CreateEnum
CREATE TYPE "PondType" AS ENUM ('TERPAL', 'BETON', 'TANAH');

-- CreateEnum
CREATE TYPE "PondStatus" AS ENUM ('ACTIVE', 'EMPTY', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('ACTIVE', 'HARVESTED', 'FAILED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pond" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "PondType" NOT NULL,
    "lengthM" DOUBLE PRECISION,
    "widthM" DOUBLE PRECISION,
    "depthM" DOUBLE PRECISION,
    "capacity" INTEGER,
    "status" "PondStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pond_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CultureCycle" (
    "id" TEXT NOT NULL,
    "pondId" TEXT NOT NULL,
    "cycleName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "seedCount" INTEGER NOT NULL,
    "initialAvgWeightG" DOUBLE PRECISION,
    "targetHarvestDate" TIMESTAMP(3),
    "status" "CycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CultureCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedLog" (
    "id" TEXT NOT NULL,
    "cultureCycleId" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "feedName" TEXT NOT NULL,
    "quantityKg" DOUBLE PRECISION NOT NULL,
    "priceTotal" DECIMAL(12,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortalityLog" (
    "id" TEXT NOT NULL,
    "cultureCycleId" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "deadCount" INTEGER NOT NULL,
    "cause" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MortalityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pond_code_key" ON "Pond"("code");

-- AddForeignKey
ALTER TABLE "CultureCycle" ADD CONSTRAINT "CultureCycle_pondId_fkey" FOREIGN KEY ("pondId") REFERENCES "Pond"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedLog" ADD CONSTRAINT "FeedLog_cultureCycleId_fkey" FOREIGN KEY ("cultureCycleId") REFERENCES "CultureCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortalityLog" ADD CONSTRAINT "MortalityLog_cultureCycleId_fkey" FOREIGN KEY ("cultureCycleId") REFERENCES "CultureCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
