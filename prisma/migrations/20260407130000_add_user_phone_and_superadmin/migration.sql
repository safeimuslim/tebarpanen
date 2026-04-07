-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'OWNER', 'ADMIN', 'WORKER');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "phone" TEXT,
ADD COLUMN "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'WORKER';

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- Seed super admin user
INSERT INTO "User" ("id", "name", "email", "phone", "password", "role", "createdAt", "updatedAt")
VALUES (
    'user_super_admin_safei_muslim',
    'Safei Muslim',
    'safeydev@gmail.com',
    '082329230000',
    'scrypt$tebar-panen-super-admin-safei$9861ae5d5873b58bd8eed76d837c62dbe10c7bf10011f82321a6cb9c2e9e2f0d62e180fb11763fae97f4114c61a86ffe326dd6ab01a46011b3536cda1b9cf6a6',
    'SUPER_ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO UPDATE SET
    "name" = EXCLUDED."name",
    "phone" = EXCLUDED."phone",
    "password" = EXCLUDED."password",
    "role" = EXCLUDED."role",
    "updatedAt" = CURRENT_TIMESTAMP;
