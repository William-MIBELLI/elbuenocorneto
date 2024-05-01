ALTER TABLE "product" RENAME COLUMN "coordonates" TO "location_id";--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "location_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "location" ADD COLUMN "coordonates" json DEFAULT '{"lat":0,"lng":0}'::json;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_location_location_id_fk" FOREIGN KEY ("location") REFERENCES "location"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "location";