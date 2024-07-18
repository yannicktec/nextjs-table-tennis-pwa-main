DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('WON', 'LOST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"enteredBy" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monthResult" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"enteredBy" integer NOT NULL,
	CONSTRAINT "monthResult_createdAt_unique" UNIQUE("createdAt")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monthResultPlayers" (
	"id" serial PRIMARY KEY NOT NULL,
	"monthResult" integer NOT NULL,
	"player" integer NOT NULL,
	"points" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playerMatches" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "type",
	"match" integer NOT NULL,
	"player" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"emoji" text,
	"createdAt" timestamp NOT NULL,
	"createdBy" integer NOT NULL,
	"rating" integer,
	"priority" integer DEFAULT 9999 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"averageSkill" real DEFAULT 25,
	"uncertainty" real DEFAULT 8.3,
	"player" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL
);
