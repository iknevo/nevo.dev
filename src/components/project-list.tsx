"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useLayoutEffect, useRef, useState } from "react";

import Project from "@/src/components/project";
import ProjectImageModal from "@/src/components/project-image-modal";
import SectionTitle from "@/src/components/section-title";
import { useGetProjects } from "@/src/features/admin/projects/api/use-get-projects";

import { LoaderSmall } from "./loader-small";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectList() {
  const { data: projects = [], isLoading } = useGetProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState({ active: false, index: 0 });

  const handleMouseEnter = (index: number) => {
    if (window.innerWidth < 768) return;
    setModal({ active: true, index });
  };

  const handleMouseLeave = (index: number) => {
    if (window.innerWidth < 768) return;
    setModal({ active: false, index });
  };

  useLayoutEffect(() => {
    if (!isLoading && projects.length > 0) {
      ScrollTrigger.refresh();
    }
  }, [isLoading, projects]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
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
    { scope: containerRef, dependencies: [projects] }
  );

  return (
    <section className="pb-section" id="selected-projects">
      <div className="container">
        <SectionTitle title="SELECTED PROJECTS" />

        {isLoading ? (
          <LoaderSmall />
        ) : projects.length === 0 ? (
          <p className="dark slide-up text-muted-foreground py-10 text-3xl">
            There&apos;s no projects added yet
          </p>
        ) : (
          <div className="group/projects relative" ref={containerRef}>
            <ProjectImageModal modal={modal} projects={projects} />
            <div className="flex flex-col max-md:gap-10" ref={projectListRef}>
              {projects.map((project, index) => (
                <Project
                  index={index}
                  project={project}
                  key={project._id}
                  onEnter={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
