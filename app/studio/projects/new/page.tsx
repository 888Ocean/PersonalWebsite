import ProjectForm from "../ProjectForm";
import { databaseIsConfigured } from "../../../lib/projects";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <main className="studio-page">
      <section className="studio-shell">
        <ProjectForm mode="create" canSave={databaseIsConfigured()} />
      </section>
    </main>
  );
}
