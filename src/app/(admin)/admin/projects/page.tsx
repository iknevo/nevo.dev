import { Metadata } from "next";

import ProjectsSection from "@/src/features/admin/projects/projects-section";

export const metadata: Metadata = {
  title: "PROJECTS"
};

export default function Page() {
  return <ProjectsSection />;
}
