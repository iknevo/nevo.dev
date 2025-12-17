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
      <div className="flex h-screen justify-center py-20">
        <Loader2 className="size-20 animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="container pb-10">
      <div className="mb-10 flex items-center justify-between">
        <SectionTitle title="PROJECTS" className="mb-0" />
        <Button
          className="dark flex items-center justify-center text-lg font-semibold"
          variant={"outline"}
          onClick={onOpen}
        >
          <span>ADD ITEM</span>
        </Button>
      </div>

      {projects.length === 0 && (
        <p className="dark text-muted-foreground py-10 text-center text-3xl">
          There&apos;s no projects added yet
        </p>
      )}

      <div className="group/projects relative">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-6.25 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectItem project={project} key={project._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
