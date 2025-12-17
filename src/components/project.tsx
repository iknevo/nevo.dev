import TransitionLink from "@/src/components/transition-link";
import { cn } from "@/src/lib/utils";
import { ProjectResponse } from "@/src/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

interface Props {
  index: number;
  project: ProjectResponse;
  selectedProject: string | null;
  onMouseEnter: (_slug: string) => void;
}
gsap.registerPlugin(useGSAP);

export default function Project({
  index,
  project,
  selectedProject,
  onMouseEnter
}: Props) {
  const externalLinkSVGRef = useRef<SVGSVGElement>(null);
  const { context, contextSafe } = useGSAP(() => {}, {
    scope: externalLinkSVGRef,
    revertOnUpdate: true
  });
  const handleMouseEnter = contextSafe?.(() => {
    onMouseEnter(project.slug);
    const arrowLine = externalLinkSVGRef.current?.querySelector(
      "#arrow-line"
    ) as SVGPathElement;
    const arrowCurb = externalLinkSVGRef.current?.querySelector(
      "#arrow-curb"
    ) as SVGPathElement;
    const box = externalLinkSVGRef.current?.querySelector(
      "#box"
    ) as SVGPathElement;

    gsap.set(box, {
      opacity: 0,
      strokeDasharray: box?.getTotalLength(),
      strokeDashoffset: box?.getTotalLength()
    });
    gsap.set(arrowLine, {
      opacity: 0,
      strokeDasharray: arrowLine?.getTotalLength(),
      strokeDashoffset: arrowLine?.getTotalLength()
    });
    gsap.set(arrowCurb, {
      opacity: 0,
      strokeDasharray: arrowCurb?.getTotalLength(),
      strokeDashoffset: arrowCurb?.getTotalLength()
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.to(externalLinkSVGRef.current, {
      autoAlpha: 1
    })
      .to(box, {
        opacity: 1,
        strokeDashoffset: 0
      })
      .to(
        arrowLine,
        {
          opacity: 1,
          strokeDashoffset: 0
        },
        "<0.2"
      )
      .to(arrowCurb, {
        opacity: 1,
        strokeDashoffset: 0
      })
      .to(
        externalLinkSVGRef.current,
        {
          autoAlpha: 0
        },
        "+=1"
      );
  });

  const handleMouseLeave = contextSafe?.(() => {
    context.kill();
  });

  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      className="project-item group py-5 leading-none transition-all first:pt-0! last:border-none last:pb-0 md:border-b md:group-hover/projects:opacity-30 md:hover:opacity-100!"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {selectedProject === null && (
        <Image
          src={project.thumbnail}
          alt="Project"
          width="300"
          height="200"
          className={cn("mb-6 w-full object-contain object-top")}
          key={project.slug}
          loading="lazy"
        />
      )}
      <div className="flex gap-2 md:gap-5">
        <div className="text-white/80">
          _{(index + 1).toString().padStart(2, "0")}.
        </div>
        <div>
          <h4 className="xs:text-6xl from-primary flex gap-4 bg-linear-to-r from-50% to-white to-50% bg-size-[200%] bg-clip-text bg-right text-3xl font-bold text-transparent transition-all duration-700 group-hover:bg-left">
            {project.name}
            <span className="text-white opacity-0 transition-all group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                ref={externalLinkSVGRef}
              >
                <path
                  id="box"
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                ></path>
                <path id="arrow-line" d="M10 14 21 3"></path>
                <path id="arrow-curb" d="M15 3h6v6"></path>
              </svg>
            </span>
          </h4>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/80">
            {project.techStack.slice(0, 3).map((tech, idx, stackArr) => (
              <div className="flex items-center gap-3" key={tech}>
                <span>{tech}</span>
                {idx !== stackArr.length - 1 && (
                  <span className="inline-block size-2 rounded-full bg-gray-600"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}
