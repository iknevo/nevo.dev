import { PenLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProjectResponse } from "@/src/types";

import { useOpenProject } from "./state/use-open-project";

interface Props {
  project: ProjectResponse;
}

export default function ProjectItem({ project }: Props) {
  const { onOpen } = useOpenProject();

  return (
    <div className="project-item group pt-5 leading-none transition-all md:group-hover/projects:opacity-30 md:hover:opacity-100!">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="mt-5 flex items-center justify-between gap-2 md:gap-5">
        <p className="from-primary bg-linear-to-r from-50% to-white to-50% bg-size-[200%] bg-clip-text bg-right text-transparent transition-all duration-700 group-hover:bg-left">
          {project.name}
        </p>
        <button
          onClick={() => onOpen(project._id)}
          className="no-cursor cursor-none"
        >
          <PenLine className="size-5" />
        </button>
      </div>
    </div>
  );
}
