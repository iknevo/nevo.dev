"use client";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { useGetProjects } from "./api/use-get-projects";
import ProjectItem from "./project-item";
import { useNewProject } from "./state/use-new-project";

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
      <div className="space-y-2 dark py-20">
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
        <Skeleton className="h-30 w-full" />
      </div>
    );

  if (projects.length === 0)
    return <div className="space-y-2 dark py-20">empty</div>;
  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <SectionTitle title="PROJECTS" />
        <Button
          className="flex items-center justify-center text-lg font-semibold"
          onClick={onOpen}
        >
          <span>Add</span>
        </Button>
      </div>

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
