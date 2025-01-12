ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'New';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "stripePaymentIntentId" varchar(255);