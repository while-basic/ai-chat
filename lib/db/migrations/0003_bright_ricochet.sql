CREATE TABLE IF NOT EXISTS "Settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"maxMessagesPerChat" integer DEFAULT 50 NOT NULL,
	"maxChatsPerUser" integer DEFAULT 10 NOT NULL,
	"maxMessageLength" integer DEFAULT 2000 NOT NULL,
	"allowNewUsers" boolean DEFAULT true NOT NULL,
	"requireEmailVerification" boolean DEFAULT true NOT NULL,
	"maintenanceMode" boolean DEFAULT false NOT NULL,
	"systemPrompt" text DEFAULT ''
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isBlocked" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" timestamp;