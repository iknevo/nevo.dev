"use client";
import TransitionLink from "@/src/components/transition-link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ArrowLeft, Code, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useGetProject } from "../features/admin/projects/api/use-get-project";

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
        y: 30,
      });
      const tl = gsap.timeline({
        delay: 0.5,
      });
      tl.to(".fade-in-later", {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
      });
      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [project, isLoading] },
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
          scrub: 0.5,
        },
      });
      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: containerRef, dependencies: [project, isLoading] },
  );

  return (
    <section className="pt-5 pb-14 px-6 md:px-0">
      <div className="container" ref={containerRef}>
        <TransitionLink
          back
          href="/"
          className="mb-16 inline-flex gap-2 items-center group h-12"
        >
          <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
          Back
        </TransitionLink>
        {isLoading ? (
          <div className="flex justify-center items-center py-10 min-h-[50vh]">
            <Loader2 className="animate-spin slide-up size-20 text-gray-500" />
          </div>
        ) : !project ? (
          <div className="flex justify-center items-center py-10 min-h-[50vh]">
            <p className="py-10 text-center dark slide-up text-muted-foreground text-3xl md:text-4xl">
              Project not found <span className="text-primary">!</span>
            </p>
          </div>
        ) : (
          <>
            <div className="top-0 min-h-[calc(100dvh-100px)] flex" id="info">
              <div className="relative w-full">
                <div className="flex items-start gap-6 mx-auto mb-10 max-w-7xl">
                  <h1 className="fade-in-later opacity-0 text-4xl md:text-6xl leading-none overflow-hidden">
                    <span className="inline-block cursor">{project.name}</span>
                  </h1>

                  <div className="fade-in-later opacity-0 flex gap-4 items-center">
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

                <div className="max-w-7xl space-y-7 pb-20 mx-auto">
                  <div className="fade-in-later">
                    <p className="text-white/80 mb-3">Year</p>
                    <span className="text-lg cursor">{project.year}</span>
                  </div>
                  <div className="fade-in-later">
                    <p className="text-white/80 mb-3">Tech &and; Technique</p>

                    <div className="text-lg">
                      <span className="cursor">
                        {project.techStack.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="fade-in-later space-y-7">
                    <p className="text-white/80 mb-3">Description</p>

                    {project.description && (
                      <div className="text-lg markdown-text cursor">
                        <p>{project.description}</p>
                      </div>
                    )}

                    <p className="text-white/80 mb-3">Key Features</p>

                    {project.features && (
                      <div className="text-lg markdown-text cursor">
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

            <div className="fade-in-later relative max-w-7xl mx-auto">
              <div
                key={project.image}
                className="group relative w-full aspect-[750/400] bg-black"
                style={{
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 50%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <a
                  href={project.image}
                  target="_blank"
                  className="absolute top-4 right-4 bg-gray-950/70 text-white size-12 inline-flex justify-center items-center transition-all opacity-0 hover:bg-primary hover:text-white group-hover:opacity-100"
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
