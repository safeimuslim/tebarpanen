-- AlterTable
ALTER TABLE "Pond" ADD COLUMN "diameterM" DOUBLE PRECISION;

-- Backfill diameter for circular ponds from the previous "Lebar / Diameter" input.
UPDATE "Pond"
SET "diameterM" = "widthM",
    "lengthM" = NULL,
    "widthM" = NULL
WHERE "shape" = 'CIRCLE'
  AND "diameterM" IS NULL;
