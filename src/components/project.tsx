import { ArrowUpRight } from "lucide-react";

import TransitionLink from "@/src/components/transition-link";
import { PROJECT_CARD_SKILLS_COUNT } from "@/src/config/constants";
import { cn } from "@/src/lib/utils";
import { ProjectResponse } from "@/src/types";

interface Props {
  index: number;
  project: ProjectResponse;
  active: boolean;
  onPreview: (index: number) => void;
}

const EASE_OUT_EXPO = "ease-[cubic-bezier(0.16,1,0.3,1)]";

const saveScroll = () => {
  sessionStorage.setItem("projects-scroll-y", String(window.scrollY));
};

export default function Project({ index, project, active, onPreview }: Props) {
  const href = `/projects/${project.slug}`;

  return (
    // The row (header + panel) is the hover/focus target, so the cursor stays inside the row it
    // just opened even while the rows around it change height. onFocus bubbles from the link.
    <div
      data-index={index}
      aria-current={active ? "true" : undefined}
      onMouseEnter={() => onPreview(index)}
      onFocus={() => onPreview(index)}
      className="project-item relative border-b border-white/[0.07] last:border-b-0"
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-primary pointer-events-none absolute top-0 left-0 h-full w-[2px] origin-top rounded-full transition-transform duration-500",
          EASE_OUT_EXPO,
          active ? "scale-y-100" : "scale-y-0"
        )}
      />

      <TransitionLink
        href={href}
        onClick={saveScroll}
        className={cn(
          "group focus-visible:outline-primary flex w-full items-center gap-4 py-3 pl-5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 sm:py-3.5",
          active ? "text-white" : "text-white/45 hover:text-white"
        )}
      >
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.12em] transition-colors duration-300 sm:text-[11px]",
            active ? "text-primary" : "text-white/40"
          )}
        >
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-lg leading-[1.15] font-medium tracking-[-0.035em] transition-transform duration-500 sm:text-xl xl:text-2xl",
            EASE_OUT_EXPO,
            active && "translate-x-2"
          )}
        >
          {project.name}
        </span>
        <span
          className={cn(
            "font-mono text-[11px] tracking-[0.08em] transition-colors duration-300",
            active ? "text-white/70" : "text-white/35"
          )}
        >
          {project.year}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className={cn(
            "text-primary size-[18px] shrink-0 transition-[opacity,translate] duration-500",
            EASE_OUT_EXPO,
            active ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0"
          )}
        />
      </TransitionLink>

      {/* Expands with the grid-rows trick: animates to the content's height without measuring. */}
      <div
        inert={!active}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none",
          EASE_OUT_EXPO,
          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "pb-5 pl-5 transition-[opacity,translate] duration-500 motion-reduce:transition-none",
              EASE_OUT_EXPO,
              active ? "translate-y-0 opacity-100 delay-100" : "-translate-y-1 opacity-0"
            )}
          >
            <p className="line-clamp-3 max-w-md text-sm leading-relaxed text-white/70">
              {project.description}
            </p>

            {project.techStack.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {project.techStack.slice(0, PROJECT_CARD_SKILLS_COUNT).map((tech) => (
                  <li
                    key={tech}
                    className="font-mono text-[11px] font-medium tracking-[0.08em] text-white/50"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
