import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

import TransitionLink from "@/src/components/transition-link";
import { cn } from "@/src/lib/utils";
import { ProjectResponse } from "@/src/types";

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
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<SVGPathElement>(null);
  const arrowLineRef = useRef<SVGPathElement>(null);
  const arrowCurbRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Setup GSAP context safely
  useGSAP(
    () => {
      return () => {
        timelineRef.current?.kill();
      };
    },
    { scope: svgRef }
  );

  const handleMouseEnter = () => {
    if (
      !svgRef.current ||
      !boxRef.current ||
      !arrowLineRef.current ||
      !arrowCurbRef.current
    )
      return;

    onMouseEnter(project.slug);

    const boxLength = boxRef.current.getTotalLength();
    const arrowLineLength = arrowLineRef.current.getTotalLength();
    const arrowCurbLength = arrowCurbRef.current.getTotalLength();

    gsap.set(svgRef.current, { autoAlpha: 0 });

    gsap.set(boxRef.current, {
      opacity: 0,
      strokeDasharray: boxLength,
      strokeDashoffset: boxLength
    });

    gsap.set(arrowLineRef.current, {
      opacity: 0,
      strokeDasharray: arrowLineLength,
      strokeDashoffset: arrowLineLength
    });

    gsap.set(arrowCurbRef.current, {
      opacity: 0,
      strokeDasharray: arrowCurbLength,
      strokeDashoffset: arrowCurbLength
    });

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1
    });

    tl.to(svgRef.current, {
      autoAlpha: 1,
      duration: 0.2
    })
      .to(boxRef.current, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.4
      })
      .to(
        arrowLineRef.current,
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.4
        },
        "<0.2"
      )
      .to(arrowCurbRef.current, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.4
      })
      .to(
        svgRef.current,
        {
          autoAlpha: 0,
          duration: 0.3
        },
        "+=1"
      );

    timelineRef.current = tl;
  };

  const handleMouseLeave = () => {
    timelineRef.current?.kill();
    timelineRef.current = null;

    if (svgRef.current) {
      gsap.set(svgRef.current, { autoAlpha: 0 });
    }
  };

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
                ref={svgRef}
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
