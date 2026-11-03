import Link from "next/link";
import { databaseIsConfigured, getProjectsForStudio } from "../lib/projects";
import { seedProjectsAction } from "./projects/actions";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const canSave = databaseIsConfigured();
  const projects = await getProjectsForStudio();

  return (
    <main className="studio-page">
      <section className="studio-shell">
        <header className="studio-header">
          <div>
            <span>TIDAL ARCHIVE STUDIO</span>
            <h1>Project editor</h1>
          </div>
          <Link href="/work">View site</Link>
        </header>

        {!canSave && (
          <p className="studio-warning">
            DATABASE_URL is not configured. Add your Supabase Postgres connection string before saving project edits.
          </p>
        )}

        <div className="studio-toolbar">
          <Link href="/studio/projects/new">New project</Link>
          <form action={seedProjectsAction}>
            <button type="submit" disabled={!canSave}>
              Seed current projects
            </button>
          </form>
        </div>

        <div className="studio-list">
          {projects.map((project) => (
            <article key={project.slug} className="studio-project-row">
              <div>
                <span>
                  {project.index} / {project.isPublished ? "PUBLISHED" : "DRAFT"} / {project.source.toUpperCase()}
                </span>
                <h2>{project.name}</h2>
                <p>{project.summary}</p>
              </div>
              <Link href={`/studio/projects/${project.slug}/edit`}>Edit</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
