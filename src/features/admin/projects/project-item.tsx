import { ProjectResponse } from "@/src/types";
import { useOpenProject } from "./state/use-open-project";
import Link from "next/link";
import Image from "next/image";
import { PenLine } from "lucide-react";

interface Props {
  project: ProjectResponse;
}

export default function ProjectItem({ project }: Props) {
  const { onOpen } = useOpenProject();

  return (
    <div className="project-item group leading-none pt-5 md:group-hover/projects:opacity-30 md:hover:opacity-100! transition-all">
      <Link href={`/projects/${project._id}`}>
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 md:gap-5 mt-5">
        <p className="transition-all duration-700 bg-linear-to-r from-primary to-white from-50% to-50% bg-size-[200%] bg-right bg-clip-text text-transparent group-hover:bg-left">
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
