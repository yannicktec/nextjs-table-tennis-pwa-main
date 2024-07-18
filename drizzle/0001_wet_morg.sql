DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE', 'HALL_OF_FAME');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "status" "status" DEFAULT 'ACTIVE';