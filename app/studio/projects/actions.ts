"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "../../../db/client";
import { projects as projectsTable } from "../../../db/schema";
import {
  projects as staticProjects,
  type Project,
  type ProjectAsset,
  type ProjectChallenge,
} from "../../components/projectData";

const themes: Project["theme"][] = ["linkphoto", "club", "agent"];

function requireDb() {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_URL is not configured. Add your Supabase Postgres connection string first.");
  }
  return db;
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseMetrics(value: string): Array<[string, string]> {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [metricValue, ...labelParts] = line.split("|").map((part) => part.trim());
      return [metricValue, labelParts.join(" | ")] as [string, string];
    })
    .filter(([metricValue, label]) => metricValue.length > 0 && label.length > 0);
}

function parseProcess(value: string): Array<[string, string, string]> {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [number, title, ...copyParts] = line.split("|").map((part) => part.trim());
      return [number, title, copyParts.join(" | ")] as [string, string, string];
    })
    .filter(([number, title, copy]) => number.length > 0 && title.length > 0 && copy.length > 0);
}

function jsonValue<T>(formData: FormData, key: string, fallback: T): T {
  const value = textValue(formData, key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`Invalid structured data for ${key}.`);
  }
}

function payloadFromForm(formData: FormData) {
  const slug = normalizeSlug(textValue(formData, "slug"));
  const theme = textValue(formData, "theme") as Project["theme"];

  if (!slug) throw new Error("Project slug is required.");
  if (!themes.includes(theme)) throw new Error("Invalid project theme.");

  return {
    slug,
    sortOrder: Number(textValue(formData, "sortOrder") || 0),
    isPublished: boolValue(formData, "isPublished"),
    indexLabel: textValue(formData, "indexLabel"),
    name: textValue(formData, "name"),
    cn: textValue(formData, "cn"),
    period: textValue(formData, "period"),
    label: textValue(formData, "label"),
    summary: textValue(formData, "summary"),
    role: textValue(formData, "role"),
    stack: textValue(formData, "stack"),
    accent: textValue(formData, "accent") || "#67b7b8",
    theme,
    metrics: parseMetrics(textValue(formData, "metrics")),
    detail: textValue(formData, "detail"),
    background: textValue(formData, "background"),
    goal: textValue(formData, "goal"),
    problem: textValue(formData, "problem"),
    solution: textValue(formData, "solution"),
    solutionAssets: jsonValue<ProjectAsset[]>(formData, "solutionAssets", []),
    aiCapability: textValue(formData, "aiCapability"),
    responsibility: textValue(formData, "responsibility"),
    process: parseProcess(textValue(formData, "process")),
    challenges: jsonValue<ProjectChallenge[]>(formData, "challenges", []),
    result: textValue(formData, "result"),
    reflection: textValue(formData, "reflection"),
    updatedAt: new Date(),
  };
}

function dbPayloadFromProject(project: Project, index: number) {
  return {
    slug: project.slug,
    sortOrder: index + 1,
    isPublished: true,
    indexLabel: project.index,
    name: project.name,
    cn: project.cn,
    period: project.period,
    label: project.label,
    summary: project.summary,
    role: project.role,
    stack: project.stack,
    accent: project.accent,
    theme: project.theme,
    metrics: project.metrics,
    detail: project.detail,
    background: project.background,
    goal: project.goal,
    problem: project.problem,
    solution: project.solution,
    solutionAssets: project.solutionAssets,
    aiCapability: project.aiCapability,
    responsibility: project.responsibility,
    process: project.process,
    challenges: project.challenges,
    result: project.result,
    reflection: project.reflection,
  };
}

function revalidateProjectPaths(slug: string, originalSlug?: string) {
  revalidatePath("/work");
  revalidatePath("/studio");
  revalidatePath(`/work/${slug}`);
  if (originalSlug && originalSlug !== slug) revalidatePath(`/work/${originalSlug}`);
}

export async function seedProjectsAction() {
  const db = requireDb();
  await db
    .insert(projectsTable)
    .values(staticProjects.map(dbPayloadFromProject))
    .onConflictDoNothing();

  revalidatePath("/work");
  revalidatePath("/studio");
  redirect("/studio");
}

export async function createProjectAction(formData: FormData) {
  const db = requireDb();
  const payload = payloadFromForm(formData);

  await db.insert(projectsTable).values(payload);
  revalidateProjectPaths(payload.slug);
  redirect(`/studio/projects/${payload.slug}/edit?saved=1`);
}

export async function updateProjectAction(formData: FormData) {
  const db = requireDb();
  const originalSlug = normalizeSlug(textValue(formData, "originalSlug"));
  const payload = payloadFromForm(formData);

  await db.update(projectsTable).set(payload).where(eq(projectsTable.slug, originalSlug));
  revalidateProjectPaths(payload.slug, originalSlug);
  redirect(`/studio/projects/${payload.slug}/edit?saved=1`);
}

export async function updateProjectCaseAction(formData: FormData) {
  const db = requireDb();
  const slug = normalizeSlug(textValue(formData, "slug"));
  if (!slug) throw new Error("Project slug is required.");

  await db
    .update(projectsTable)
    .set({
      background: textValue(formData, "background"),
      goal: textValue(formData, "goal"),
      stack: textValue(formData, "stack"),
      problem: textValue(formData, "problem"),
      solution: textValue(formData, "solution"),
      solutionAssets: jsonValue<ProjectAsset[]>(formData, "solutionAssets", []),
      process: jsonValue<Array<[string, string, string]>>(formData, "process", []),
      challenges: jsonValue<ProjectChallenge[]>(formData, "challenges", []),
      result: textValue(formData, "result"),
      metrics: jsonValue<Array<[string, string]>>(formData, "metrics", []),
      reflection: textValue(formData, "reflection"),
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.slug, slug));

  revalidateProjectPaths(slug);
  redirect(`/work/${slug}?edit=1&saved=1`);
}
