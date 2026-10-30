import Image from "next/image";

import TransitionLink from "@/src/components/transition-link";
import { ProjectResponse } from "@/src/types";

interface Props {
  index: number;
  project: ProjectResponse;
}

export default function ProjectMobile({ index, project }: Props) {
  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      onClick={() => {
        sessionStorage.setItem("projects-scroll-y", String(window.scrollY));
      }}
      className="group focus-visible:outline-primary block focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/[0.025]">
        <Image
          src={project.thumbnail}
          alt={`${project.name} preview`}
          fill
          sizes="(max-width: 1023px) 100vw, 0px"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.015] sm:p-4"
        />
      </div>
      <div className="mt-5 flex items-baseline gap-3 sm:mt-6 sm:gap-4">
        <span className="text-primary font-mono text-sm tracking-[0.12em]">
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <h3 className="text-2xl leading-none font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          {project.name}
        </h3>
      </div>
      {project.techStack.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
          {project.techStack.slice(0, 3).map((tech) => (
            <li
              key={tech}
              className="font-mono text-[10px] tracking-[0.08em] text-white/45 sm:text-[11px]"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
    </TransitionLink>
  );
}
