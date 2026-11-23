import { ExternalLink, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import { ProjectResponse } from "@/src/types";

import { useOpenProject } from "./state/use-open-project";

interface Props {
  project: ProjectResponse;
}

export default function ProjectItem({ project }: Props) {
  const { onOpen } = useOpenProject();

  return (
    <div
      className={cn(
        "project-item group pt-5 leading-none transition-all md:group-hover/projects:opacity-30 md:hover:opacity-100!",
        project.hide && "opacity-60"
      )}
    >
      <button
        type="button"
        aria-label={`Edit ${project.name}`}
        onClick={() => onOpen(project._id)}
        className="cursor block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.thumbnail}
            alt=""
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-[1.02]",
              project.hide && "grayscale"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </button>
      <div className="mt-5 flex items-center justify-between gap-2 md:gap-5">
        <p className="from-primary min-w-0 truncate bg-linear-to-r from-50% to-white to-50% bg-size-[200%] bg-clip-text bg-right text-transparent transition-all duration-700 group-hover:bg-left">
          {project.name}
        </p>
        {project.hide ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                aria-label={`${project.name} is hidden from the site`}
                className="text-white/50 outline-none focus-visible:text-white"
              >
                <EyeOff className="size-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Hidden from the site</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                aria-label={`Open ${project.name} on the site`}
                className="text-white/50 transition-colors hover:text-white"
              >
                <ExternalLink className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>View on site</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
