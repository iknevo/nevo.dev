import Image from "next/image";

import { ProjectResponse } from "@/src/types";

interface Props {
  activeIndex: number;
  previousIndex: number | null;
  projects: ProjectResponse[];
}

export default function ProjectImagePreview({ activeIndex, previousIndex, projects }: Props) {
  const activeProject = projects[activeIndex] ?? projects[0];
  const previousProject = previousIndex === null ? null : projects[previousIndex];

  if (!activeProject) return null;

  return (
    <article aria-live="polite" className="w-full">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.13em] text-white/35 sm:mb-4 sm:text-[11px]">
        <span>SELECTED WORK</span>
        <span>
          {(activeIndex + 1).toString().padStart(2, "0")} /{" "}
          {projects.length.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/[0.025]">
        {previousProject && previousProject._id !== activeProject._id && (
          <Image
            key={`previous-${previousProject._id}`}
            src={previousProject.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1280px) 670px, (min-width: 1024px) 58vw, 100vw"
            className="project-preview-exit object-contain p-2 sm:p-4"
          />
        )}
        <Image
          key={`active-${activeProject._id}`}
          src={activeProject.thumbnail}
          alt={`${activeProject.name} preview`}
          fill
          priority={activeIndex === 0}
          sizes="(min-width: 1280px) 670px, (min-width: 1024px) 58vw, 100vw"
          className={`object-contain p-2 sm:p-4 ${previousProject ? "project-preview-enter" : ""}`}
        />
      </div>

      <div className="mt-5 sm:mt-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl leading-none font-semibold tracking-[-0.045em] text-white sm:text-3xl">
            {activeProject.name}
          </h3>
          <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/55 sm:text-[15px] lg:line-clamp-1">
            {activeProject.description}
          </p>
          {activeProject.techStack.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
              {activeProject.techStack.slice(0, 3).map((tech) => (
                <li
                  key={tech}
                  className="font-mono text-[10px] tracking-[0.08em] text-white/35 sm:text-[11px]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
