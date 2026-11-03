import { asc, eq } from "drizzle-orm";
import { getDb, hasDatabaseUrl } from "../../db/client";
import { projects as projectsTable } from "../../db/schema";
import { projects as staticProjects, type Project } from "../components/projectData";

type ProjectRow = typeof projectsTable.$inferSelect;

export type StudioProject = Project & {
  isPublished: boolean;
  sortOrder: number;
  source: "database" | "static";
};

function rowToProject(row: ProjectRow): StudioProject {
  const fallback = staticProjects.find((project) => project.slug === row.slug);

  return {
    slug: row.slug,
    index: row.indexLabel,
    name: row.name,
    cn: row.cn,
    period: row.period,
    label: row.label,
    summary: row.summary,
    role: row.role,
    stack: row.stack,
    accent: row.accent,
    theme: row.theme,
    metrics: row.metrics,
    detail: row.detail,
    background: row.background || fallback?.background || row.detail,
    goal: row.goal || fallback?.goal || row.summary,
    problem: row.problem,
    solution: row.solution,
    solutionAssets: row.solutionAssets,
    aiCapability: row.aiCapability,
    responsibility: row.responsibility,
    process: row.process,
    challenges: row.challenges.length > 0 ? row.challenges : fallback?.challenges || [],
    result: row.result,
    reflection: row.reflection,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
    source: "database",
  };
}

function staticToStudioProject(project: Project, index: number): StudioProject {
  return {
    ...project,
    isPublished: true,
    sortOrder: index + 1,
    source: "static",
  };
}

export function databaseIsConfigured() {
  return hasDatabaseUrl();
}

export async function getProjectsForSite(): Promise<Project[]> {
  const db = getDb();
  if (!db) return staticProjects;

  try {
    const rows = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.isPublished, true))
      .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.createdAt));

    return rows.length > 0 ? rows.map(rowToProject) : staticProjects;
  } catch {
    return staticProjects;
  }
}

export async function getProjectForSite(slug: string): Promise<Project | undefined> {
  const db = getDb();
  if (!db) return staticProjects.find((project) => project.slug === slug);

  try {
    const [row] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.slug, slug))
      .limit(1);

    if (row) return row.isPublished ? rowToProject(row) : undefined;

    const existingRows = await db.select({ id: projectsTable.id }).from(projectsTable).limit(1);
    if (existingRows.length > 0) return undefined;

    return staticProjects.find((project) => project.slug === slug);
  } catch {
    return staticProjects.find((project) => project.slug === slug);
  }
}

export async function getProjectsForStudio(): Promise<StudioProject[]> {
  const db = getDb();
  if (!db) return staticProjects.map(staticToStudioProject);

  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.createdAt));

  return rows.map(rowToProject);
}

export async function getProjectForStudio(slug: string): Promise<StudioProject | undefined> {
  const db = getDb();
  if (!db) {
    const project = staticProjects.find((item) => item.slug === slug);
    return project ? staticToStudioProject(project, staticProjects.indexOf(project)) : undefined;
  }

  const [row] = await db.select().from(projectsTable).where(eq(projectsTable.slug, slug)).limit(1);
  return row ? rowToProject(row) : undefined;
}
