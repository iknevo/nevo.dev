"use client";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetProjects } from "./api/use-get-projects";
import ProjectItem from "./project-item";
import { useNewProject } from "./state/use-new-project";

export default function ProjectsSection() {
  const { data: projects = [], isLoading } = useGetProjects();
  const { onOpen } = useNewProject();

  if (isLoading)
    return (
      <div className="flex justify-center py-20 h-screen">
        <Loader2 className="animate-spin size-20 text-gray-500" />
      </div>
    );

  return (
    <div className="container pb-10">
      <div className="flex justify-between items-center mb-10">
        <SectionTitle title="PROJECTS" className="mb-0" />
        <Button
          className="flex items-center justify-center text-lg font-semibold dark"
          variant={"outline"}
          onClick={onOpen}
        >
          <span>ADD ITEM</span>
        </Button>
      </div>

      {projects.length === 0 && (
        <p className="py-10 text-center dark text-muted-foreground text-3xl">
          There&apos;s no projects added yet
        </p>
      )}

      <div className="group/projects relative">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start lg:grid-cols-4 max-md:gap-10">
          {projects.map((project) => (
            <ProjectItem project={project} key={project._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
