import { ArrowUpRight } from "lucide-react";

import TransitionLink from "@/src/components/transition-link";
import { cn } from "@/src/lib/utils";
import { ProjectResponse } from "@/src/types";

interface Props {
  index: number;
  project: ProjectResponse;
  active: boolean;
  onPreview: (index: number) => void;
}

export default function Project({ index, project, active, onPreview }: Props) {
  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      onClick={() => {
        sessionStorage.setItem("projects-scroll-y", String(window.scrollY));
      }}
      onMouseEnter={() => onPreview(index)}
      onFocus={() => onPreview(index)}
      aria-current={active ? "true" : undefined}
      className={cn(
        "project-item group focus-visible:outline-primary relative flex w-full items-center gap-4 border-b border-white/[0.07] py-5 text-left transition-colors duration-300 last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-2 sm:py-6",
        active ? "text-white" : "text-white/45 hover:text-white"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-primary absolute right-0 bottom-0 h-px w-full origin-left transition-transform duration-500 ease-out",
          active
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        )}
      />
      <span
        className={cn(
          "font-mono text-[10px] tracking-[0.12em] sm:text-[11px]",
          active ? "text-primary" : "text-white/35"
        )}
      >
        {(index + 1).toString().padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1 text-xl leading-none font-medium tracking-[-0.035em] sm:text-2xl xl:text-[1.75rem]">
        {project.name}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className={cn(
          "text-primary size-[18px] shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
        )}
      />
    </TransitionLink>
  );
}
