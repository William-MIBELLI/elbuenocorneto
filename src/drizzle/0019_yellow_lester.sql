ALTER TABLE "product" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
