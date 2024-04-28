ALTER TABLE "user" ADD COLUMN "rating" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "rate_number" integer;--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "rating";--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "rate_number";