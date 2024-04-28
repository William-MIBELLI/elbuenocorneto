DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('colissimo', 'laposte', 'mondialrelay', 'chronopost');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "type",
	"label" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"icon_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image" (
	"id" text NOT NULL,
	"product_id" text,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text,
	"street_name" text,
	"postcode" integer NOT NULL,
	"city" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_delivery_link" (
	"product_id" text NOT NULL,
	"delivery_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"rating" integer,
	"rate_number" integer,
	"title" text NOT NULL,
	"price" numeric NOT NULL,
	"coordonates" json DEFAULT '{"lat":0,"lng":0}'::json,
	"location" json DEFAULT '{"city":"Carcassonne","postal":11000}'::json,
	"created_at" timestamp DEFAULT now(),
	"category" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_delivery_link" ADD CONSTRAINT "product_delivery_link_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_delivery_link" ADD CONSTRAINT "product_delivery_link_delivery_id_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
