ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" boolean NOT NULL DEFAULT false;