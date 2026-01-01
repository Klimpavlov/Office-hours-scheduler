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
ALTER TABLE "availability_rule" ADD CONSTRAINT "availability_rule_specialist_id_user_id_fk" FOREIGN KEY ("specialist_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;