import { notFound } from "next/navigation";
import ProjectDetail from "../../components/ProjectDetail";
import { databaseIsConfigured, getProjectForSite, getProjectForStudio } from "../../lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const editMode = query.edit === "1";
  const project = editMode ? await getProjectForStudio(slug) : await getProjectForSite(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} editMode={editMode} canSave={databaseIsConfigured()} saved={query.saved === "1"} />;
}
