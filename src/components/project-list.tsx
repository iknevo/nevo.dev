"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const previewIndexRef = useRef(0);
  const transitionIdRef = useRef(0);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previousPreviewIndex, setPreviousPreviewIndex] = useState<number | null>(null);

  const handlePreviewChange = (index: number) => {
    if (previewIndexRef.current === index) return;

    const previousIndex = previewIndexRef.current;
    previewIndexRef.current = index;
    setPreviousPreviewIndex(previousIndex);
    setPreviewIndex(index);

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    const transitionId = ++transitionIdRef.current;
    transitionTimeoutRef.current = setTimeout(() => {
      if (transitionIdRef.current === transitionId) {
        setPreviousPreviewIndex(null);
        transitionTimeoutRef.current = null;
      }
    }, 380);
  };

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    },
    []
  );

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
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ProjectImagePreview
                  activeIndex={previewIndex}
                  previousIndex={previousPreviewIndex}
                  projects={projects}
                />
              </div>
              <div className="group/projects flex flex-col lg:pt-1">
                {projects.map((project, index) => (
                  <Project
                    index={index}
                    project={project}
                    key={project._id}
                    active={previewIndex === index}
                    onPreview={handlePreviewChange}
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
