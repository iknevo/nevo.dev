"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ArrowLeft, Code, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import TransitionLink from "@/src/components/transition-link";
import { useGetProject } from "@/src/features/admin/projects/api/use-get-project";

interface Props {
  id: string;
}
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ProjectDetails({ id }: Props) {
  const { data: project, isLoading } = useGetProject(id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [project, isLoading]);

  useGSAP(
    () => {
      if (!containerRef.current || !project) return;

      gsap.set(".fade-in-later", {
        autoAlpha: 0,
        y: 30
      });
      const tl = gsap.timeline({
        delay: 0.5
      });
      tl.to(".fade-in-later", {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1
      });
      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [project, isLoading] }
  );

  useGSAP(
    () => {
      if (!containerRef.current || !project) return;
      if (window.innerWidth < 992) return;

      const tween = gsap.to("#info", {
        filter: "blur(3px)",
        autoAlpha: 0,
        scale: 0.9,
        position: "sticky",
        scrollTrigger: {
          trigger: "#info",
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: 0.5
        }
      });
      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [project, isLoading] }
  );

  return (
    <section className="px-6 pt-5 pb-14 md:px-0">
      <div className="container" ref={containerRef}>
        <TransitionLink
          href="/"
          className="group mb-16 inline-flex h-12 items-center gap-2"
        >
          <ArrowLeft className="group-hover:text-primary transition-all duration-300 group-hover:-translate-x-1" />
          Back
        </TransitionLink>
        {isLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center py-10">
            <Loader2 className="slide-up size-20 animate-spin text-gray-500" />
          </div>
        ) : !project ? (
          <div className="flex min-h-[50vh] items-center justify-center py-10">
            <p className="dark slide-up text-muted-foreground py-10 text-center text-3xl md:text-4xl">
              Project not found <span className="text-primary">!</span>
            </p>
          </div>
        ) : (
          <>
            <div className="top-0 flex min-h-[calc(100dvh-100px)]" id="info">
              <div className="relative w-full">
                <div className="mx-auto mb-10 flex max-w-7xl items-start gap-6">
                  <h1 className="fade-in-later overflow-hidden text-4xl leading-none opacity-0 md:text-6xl">
                    <span className="cursor inline-block">{project.name}</span>
                  </h1>

                  <div className="fade-in-later flex items-center gap-4 opacity-0">
                    {project.sourceCode && (
                      <a
                        href={project.sourceCode}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover:text-primary"
                      >
                        <Code size={30} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover:text-primary"
                      >
                        <ExternalLink size={30} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mx-auto max-w-7xl space-y-7 pb-20">
                  <div className="fade-in-later">
                    <p className="mb-3 text-white/80">Year</p>
                    <span className="cursor text-lg">{project.year}</span>
                  </div>
                  <div className="fade-in-later">
                    <p className="mb-3 text-white/80">Tech &and; Technique</p>

                    <div className="text-lg">
                      <span className="cursor">
                        {project.techStack.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="fade-in-later space-y-7">
                    <p className="mb-3 text-white/80">Description</p>

                    {project.description && (
                      <div className="markdown-text cursor text-lg">
                        <p>{project.description}</p>
                      </div>
                    )}

                    <p className="mb-3 text-white/80">Key Features</p>

                    {project.features && (
                      <div className="markdown-text cursor text-lg">
                        <ul>
                          {project.features.map((feat) => (
                            <li key={feat}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-in-later relative mx-auto max-w-7xl">
              <div
                key={project.image}
                className="group relative aspect-[750/400] w-full bg-black"
                style={{
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 50%",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <a
                  href={project.image}
                  target="_blank"
                  rel="noreferrer noopenner"
                  className="hover:bg-primary absolute top-4 right-4 inline-flex size-12 items-center justify-center bg-gray-950/70 text-white opacity-0 transition-all group-hover:opacity-100 hover:text-white"
                >
                  <ExternalLink />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
