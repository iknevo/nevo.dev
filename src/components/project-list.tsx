"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useLayoutEffect, useRef, useState } from "react";

import Project from "@/src/components/project";
import ProjectImagePreview from "@/src/components/project-image-preview";
import ProjectMobile from "@/src/components/project-mobile";
import SectionTitle from "@/src/components/section-title";
import { useGetProjects } from "@/src/features/admin/projects/api/use-get-projects";

import { LoaderSmall } from "./loader-small";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectList() {
  const { data: projects = [], isLoading } = useGetProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const restoredScrollRef = useRef(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useLayoutEffect(() => {
    if (!isLoading && projects.length > 0) {
      ScrollTrigger.refresh();
    }
  }, [isLoading, projects]);

  useLayoutEffect(() => {
    if (isLoading || restoredScrollRef.current) return;

    const savedScroll = sessionStorage.getItem("projects-scroll-y");
    if (savedScroll === null) return;

    const scrollY = Number(savedScroll);
    if (!Number.isFinite(scrollY)) return;

    restoredScrollRef.current = true;
    sessionStorage.removeItem("projects-scroll-y");
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
  }, [isLoading]);

  // One-time staggered entrance.
  useGSAP(
    () => {
      if (!containerRef.current || !projects.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: containerRef.current, start: "top 80%", once: true };

      gsap.from(".project-preview-wrap", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: trigger,
      });
      gsap.from(".project-item", {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.1,
        scrollTrigger: trigger,
      });
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.from(card, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
        });
      });
    },
    { scope: containerRef, dependencies: [projects] }
  );

  return (
    <section className="pb-section" id="selected-projects">
      <div className="container">
        <SectionTitle title="PROJECTS" />

        {isLoading ? (
          <LoaderSmall />
        ) : projects.length === 0 ? (
          <p className="dark slide-up text-muted-foreground py-10 text-3xl">
            There&apos;s no projects added yet
          </p>
        ) : (
          <div className="relative" ref={containerRef}>
            <div className="flex flex-col gap-16 sm:gap-20 lg:hidden">
              {projects.map((project, index) => (
                <ProjectMobile index={index} key={project._id} project={project} />
              ))}
            </div>

            <div className="hidden items-start gap-8 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)] lg:gap-10 xl:gap-14">
              <div className="project-preview-wrap lg:sticky lg:top-24 lg:self-start">
                <ProjectImagePreview activeIndex={previewIndex} projects={projects} />
              </div>
              <div className="relative flex flex-col lg:pt-1">
                {projects.map((project, index) => (
                  <Project
                    index={index}
                    project={project}
                    key={project._id}
                    active={previewIndex === index}
                    onPreview={setPreviewIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
