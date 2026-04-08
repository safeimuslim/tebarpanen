-- AlterTable
ALTER TABLE "Pond" ADD COLUMN "constructionCost" DECIMAL(14,2),
ADD COLUMN "installedAt" TIMESTAMP(3),
ADD COLUMN "depreciationMonths" INTEGER;
