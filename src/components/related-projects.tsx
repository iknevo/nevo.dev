"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

import TransitionLink from "@/src/components/transition-link";
import { useGetProjects } from "@/src/features/admin/projects/api/use-get-projects";

interface Props {
  currentProjectId: string;
}

export default function RelatedProjects({ currentProjectId }: Props) {
  const { data: projects = [], isLoading } = useGetProjects();
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isLoading) return;
      gsap.from(".project-navigation", {
        autoAlpha: 0,
        y: 12,
        duration: 0.45,
        ease: "power3.out",
      });
    },
    { scope: listRef, dependencies: [isLoading, projects.length] }
  );

  return (
    <section className="mt-20 pb-20" ref={listRef}>
      {!isLoading && <ProjectNavigation projects={projects} currentProjectId={currentProjectId} />}
    </section>
  );
}

function ProjectNavigation({
  projects,
  currentProjectId,
}: {
  projects: NonNullable<ReturnType<typeof useGetProjects>["data"]>;
  currentProjectId: string;
}) {
  const currentIndex = projects.findIndex((project) => project._id === currentProjectId);

  if (currentIndex === -1) return null;

  const previousProject = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : undefined;

  if (!previousProject && !nextProject) return null;

  return (
    <nav
      className="project-navigation grid grid-cols-2 border-y border-white/15 max-sm:grid-cols-1"
      aria-label="Project navigation"
    >
      {previousProject ? (
        <TransitionLink
          href={`/projects/${previousProject.slug}`}
          aria-label={`Go to previous project: ${previousProject.name}`}
          className="group focus-visible:text-primary flex min-w-0 flex-col gap-2 py-5 pr-6 text-left transition-colors focus-visible:outline-none"
        >
          <span className="group-hover:text-primary flex items-center gap-2 text-[10px] tracking-[0.18em] text-white/45 uppercase transition-colors">
            <ArrowLeft
              className="size-3.5 shrink-0 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Previous
          </span>
          <span className="group-hover:text-primary truncate text-base text-white/90 transition-colors sm:text-lg">
            {previousProject.name}
          </span>
        </TransitionLink>
      ) : (
        <span className="max-sm:hidden" />
      )}
      {nextProject ? (
        <TransitionLink
          href={`/projects/${nextProject.slug}`}
          aria-label={`Go to next project: ${nextProject.name}`}
          className={`group focus-visible:text-primary flex min-w-0 flex-col items-end gap-2 py-5 pl-6 text-right transition-colors focus-visible:outline-none ${previousProject ? "border-l border-white/15 max-sm:border-t max-sm:border-l-0 max-sm:pt-4" : ""}`}
        >
          <span className="group-hover:text-primary flex items-center gap-2 text-[10px] tracking-[0.18em] text-white/45 uppercase transition-colors">
            Next
            <ArrowRight
              className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
          <span className="group-hover:text-primary truncate text-base text-white/90 transition-colors sm:text-lg">
            {nextProject.name}
          </span>
        </TransitionLink>
      ) : null}
    </nav>
  );
}
