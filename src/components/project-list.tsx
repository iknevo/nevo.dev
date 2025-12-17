"use client";

import Project from "@/src/components/project";
import SectionTitle from "@/src/components/section-title";
import { useGetProjects } from "@/src/features/admin/projects/api/use-get-projects";
import { cn } from "@/src/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectList() {
  const { data: projects = [], isLoading } = useGetProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const imageContainer = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>("");

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [isLoading, projects]);

  useGSAP(
    (_, contextSafe) => {
      if (window.innerWidth < 768) {
        setSelectedProject(null);
        return;
      }

      const handleMouseMove = contextSafe?.((e: MouseEvent) => {
        if (!containerRef.current) return;
        if (!imageContainer.current) return;

        if (window.innerWidth < 768) {
          setSelectedProject(null);
          return;
        }

        const containerRect = containerRef.current?.getBoundingClientRect();
        const imageRect = imageContainer.current.getBoundingClientRect();
        const offsetTop = e.clientY - containerRect.y;

        if (
          containerRect.y > e.clientY ||
          containerRect.bottom < e.clientY ||
          containerRect.x > e.clientX ||
          containerRect.right < e.clientX
        ) {
          return gsap.to(imageContainer.current, {
            duration: 0.3,
            opacity: 0
          });
        }

        gsap.to(imageContainer.current, {
          y: offsetTop - imageRect.height / 2,
          duration: 1,
          opacity: 1
        });
      }) as any;

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef, dependencies: [projects] }
  );

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top 80%",
          toggleActions: "restart none none reverse",
          scrub: 1
        }
      });

      tl.from(containerRef.current, {
        y: 150,
        opacity: 0
      });
    },
    { scope: containerRef, dependencies: [projects] }
  );

  const handleMouseEnter = (slug: string) => {
    if (window.innerWidth < 768) {
      setSelectedProject(null);
      return;
    }

    setSelectedProject(slug);
  };

  return (
    <section className="pb-section" id="selected-projects">
      <div className="container">
        <SectionTitle title="SELECTED PROJECTS" />

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="slide-up size-20 animate-spin text-gray-500" />
          </div>
        ) : projects.length === 0 ? (
          <p className="dark slide-up text-muted-foreground py-10 text-center text-3xl">
            There&apos;s no projects added yet
          </p>
        ) : (
          <div className="group/projects relative" ref={containerRef}>
            {selectedProject !== null && (
              <div
                className="pointer-events-none absolute top-0 right-0 z-1 aspect-3/4 w-[200px] overflow-hidden opacity-0 max-md:hidden xl:w-[350px]"
                ref={imageContainer}
              >
                {projects.map((project) => (
                  <Image
                    src={project.thumbnail}
                    alt="Project"
                    width="400"
                    height="500"
                    className={cn(
                      "absolute inset-0 h-full w-full object-contain object-top transition-all duration-500",
                      {
                        "opacity-0": project.slug !== selectedProject
                      }
                    )}
                    ref={imageRef}
                    key={project.slug}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col max-md:gap-10" ref={projectListRef}>
              {projects.map((project, index) => (
                <Project
                  index={index}
                  project={project}
                  selectedProject={selectedProject}
                  onMouseEnter={handleMouseEnter}
                  key={project._id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
