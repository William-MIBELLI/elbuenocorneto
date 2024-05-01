ALTER TABLE "user" RENAME COLUMN "location" TO "location_id";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_location_location_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "location_id" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
