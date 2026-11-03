import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { ProjectAsset, ProjectChallenge } from "../app/components/projectData";

export const projectThemeEnum = pgEnum("project_theme", ["linkphoto", "club", "agent"]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 96 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(false),
    indexLabel: varchar("index_label", { length: 16 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    cn: varchar("cn", { length: 160 }).notNull(),
    period: varchar("period", { length: 48 }).notNull(),
    label: varchar("label", { length: 80 }).notNull(),
    summary: text("summary").notNull(),
    role: varchar("role", { length: 160 }).notNull(),
    stack: varchar("stack", { length: 220 }).notNull(),
    accent: varchar("accent", { length: 24 }).notNull().default("#67b7b8"),
    theme: projectThemeEnum("theme").notNull().default("agent"),
    metrics: jsonb("metrics")
      .$type<Array<[string, string]>>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    detail: text("detail").notNull(),
    background: text("background").notNull().default(""),
    goal: text("goal").notNull().default(""),
    problem: text("problem").notNull(),
    solution: text("solution").notNull(),
    solutionAssets: jsonb("solution_assets")
      .$type<ProjectAsset[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    aiCapability: text("ai_capability").notNull(),
    responsibility: text("responsibility").notNull(),
    process: jsonb("process")
      .$type<Array<[string, string, string]>>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    challenges: jsonb("challenges")
      .$type<ProjectChallenge[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    result: text("result").notNull(),
    reflection: text("reflection").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("projects_slug_idx").on(table.slug)],
);
