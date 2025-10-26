import { AdminHeader } from "../components/admin-header";
import ProjectsSection from "./projects/projects-section";
import StackSection from "./stack/stack-section";

export default function AdminPage() {
  return (
    <section className="min-h-screen container px-8 py-4 space-y-5">
      <AdminHeader />
      <ProjectsSection />
      <StackSection />
    </section>
  );
}
