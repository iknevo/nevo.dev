"use client";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { PROJECTS } from "@/src/lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { CirclePlus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import ProjectItem from "./project-item";
import { useNewProject } from "./state/use-new-project";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectsPage() {
  const { onOpen } = useNewProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(
    PROJECTS[0].slug
  );

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

  const handleMouseEnter = (slug: string) => {
    if (window.innerWidth < 768) {
      setSelectedProject(null);
      return;
    }

    setSelectedProject(slug);
  };
  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <SectionTitle title="PROJECTS" />
        <Button
          className="flex items-center justify-center text-lg font-semibold"
          onClick={onOpen}
        >
          <span>add project</span>
        </Button>
      </div>

      <div className="group/projects relative" ref={containerRef}>
        <div className="flex flex-col max-md:gap-10" ref={projectListRef}>
          {PROJECTS.map((project, index) => (
            <ProjectItem
              index={index}
              project={project}
              selectedProject={selectedProject}
              onMouseEnter={handleMouseEnter}
              key={project.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
