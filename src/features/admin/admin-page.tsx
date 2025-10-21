import { AdminHeader } from "../components/admin-header";
import ProjectsPage from "./projects/projects-page";

export default function AdminPage() {

  return (
    <section className="min-h-screen container px-8 space-y-5">
      <AdminHeader />
      <ProjectsPage />
    </section>
  );
}
