CREATE TYPE "public"."booking_status" AS ENUM('REQUESTED', 'APPROVED', 'DECLINED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('PENDING', 'APPROVED', 'FLAGGED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "availability_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"specialist_id" text NOT NULL,
	"weekday" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"slot_duration_minutes" integer NOT NULL,
	"timezone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"specialist_id" text NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"status" "booking_status" DEFAULT 'REQUESTED' NOT NULL,
	"description_json" jsonb,
	"moderation_status" "moderation_status" DEFAULT 'PENDING' NOT NULL,
	"moderation_reason" text,
	"moderation_categories" jsonb,
	"moderation_model" text,
	"moderation_provider" text,
	"moderation_reviewed_at" timestamp,
	"moderation_reviewed_by" text,
	"approved_at" timestamp,
	"approved_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status_changed_at" timestamp,
	"status_changed_by" text
);
--> statement-breakpoint
CREATE TABLE "specialist_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"bio" text,
	"tags" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "specialist_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "availability_rule" ADD CONSTRAINT "availability_rule_specialist_id_user_id_fk" FOREIGN KEY ("specialist_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_specialist_id_user_id_fk" FOREIGN KEY ("specialist_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_moderation_reviewed_by_user_id_fk" FOREIGN KEY ("moderation_reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "specialist_profile" ADD CONSTRAINT "specialist_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "availability_rule_specialist_idx" ON "availability_rule" USING btree ("specialist_id");--> statement-breakpoint
CREATE UNIQUE INDEX "booking_specialist_starts_at_unique" ON "booking" USING btree ("specialist_id","starts_at");--> statement-breakpoint
CREATE INDEX "booking_specialist_idx" ON "booking" USING btree ("specialist_id");--> statement-breakpoint
CREATE INDEX "booking_user_idx" ON "booking" USING btree ("user_id");