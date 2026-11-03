import { notFound } from "next/navigation";
import { databaseIsConfigured, getProjectForStudio } from "../../../../lib/projects";
import ProjectForm from "../../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectForStudio(slug);
  if (!project) notFound();

  return (
    <main className="studio-page">
      <section className="studio-shell">
        <ProjectForm project={project} mode="edit" canSave={databaseIsConfigured()} />
      </section>
    </main>
  );
}
