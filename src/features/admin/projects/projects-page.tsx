"use client";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { useGetProjects } from "./api/use-get-projects";
import ProjectItem from "./project-item";
import { useNewProject } from "./state/use-new-project";
import { Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjects();
  const { onOpen } = useNewProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top 80%",
          toggleActions: "restart none none reverse",
          scrub: 1,
        },
      });

      tl.from(containerRef.current, {
        y: 150,
        opacity: 0,
      });
    },
    { scope: containerRef }
  );

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin size-20 text-gray-500" />
      </div>
    );

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-10">
        <SectionTitle title="PROJECTS" className="mb-0" />
        <Button
          className="flex items-center justify-center text-lg font-semibold dark"
          variant={"outline"}
          onClick={onOpen}
        >
          <span>Add</span>
        </Button>
      </div>

      {projects.length === 0 && <p className="py-10 text-center dark text-muted-foreground text-3xl">
        There&apos;s no projects added yet
      </p>}

      <div className="group/projects relative" ref={containerRef}>
        <div className="flex flex-col max-md:gap-10" ref={projectListRef}>
          {projects.map((project, index) => (
            <ProjectItem index={index} project={project} key={project.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
