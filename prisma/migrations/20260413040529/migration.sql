-- This migration only removes the WaterQuality foreign-key index that existed
-- at this point in the migration history.
DROP INDEX IF EXISTS "WaterQualityLog_cultureCycleId_idx";
