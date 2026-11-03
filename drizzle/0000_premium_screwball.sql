CREATE TYPE "public"."project_theme" AS ENUM('linkphoto', 'club', 'agent');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(96) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"index_label" varchar(16) NOT NULL,
	"name" varchar(120) NOT NULL,
	"cn" varchar(160) NOT NULL,
	"period" varchar(48) NOT NULL,
	"label" varchar(80) NOT NULL,
	"summary" text NOT NULL,
	"role" varchar(160) NOT NULL,
	"stack" varchar(220) NOT NULL,
	"accent" varchar(24) DEFAULT '#67b7b8' NOT NULL,
	"theme" "project_theme" DEFAULT 'agent' NOT NULL,
	"metrics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"detail" text NOT NULL,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"ai_capability" text NOT NULL,
	"responsibility" text NOT NULL,
	"process" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"result" text NOT NULL,
	"reflection" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");