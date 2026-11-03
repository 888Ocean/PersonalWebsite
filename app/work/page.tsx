import CurrentExperience from "../components/CurrentExperience";
import { getProjectsForSite } from "../lib/projects";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const projects = await getProjectsForSite();
  return <CurrentExperience projects={projects} />;
}
