import ProjectsSection from "@/src/features/admin/projects/projects-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MANAGE PROJECTS",
};

export default function Page() {
  return <ProjectsSection />;
}
