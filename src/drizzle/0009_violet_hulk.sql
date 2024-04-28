DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_username_user_name_fk" FOREIGN KEY ("username") REFERENCES "user"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
