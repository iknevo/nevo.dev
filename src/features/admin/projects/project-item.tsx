import { ProjectResponse } from "@/src/types";
import { useOpenProject } from "./state/use-open-project";

interface Props {
  index: number;
  project: ProjectResponse;
}

export default function ProjectItem({ index, project }: Props) {
  const { onOpen } = useOpenProject();

  return (
    <div
      role="button"
      onClick={() => onOpen(project._id)}
      className="project-item group leading-none py-5 md:border-b first:pt-0! last:pb-0 last:border-none md:group-hover/projects:opacity-30 md:hover:opacity-100! transition-all"
    >
      <div className="flex gap-2 md:gap-5">
        <div className="text-white/80">
          _{(index + 1).toString().padStart(2, "0")}.
        </div>
        <div className="">
          <h4 className="text-3xl xs:text-6xl flex gap-4 font-bold transition-all duration-700 bg-linear-to-r from-primary to-white from-50% to-50% bg-size-[200%] bg-right bg-clip-text text-transparent group-hover:bg-left">
            {project.name}
          </h4>
          <div className="mt-2 flex flex-wrap gap-3 text-white/80 text-sm">
            {project.techStack.map((tech, idx, stackArr) => (
              <div className="gap-3 flex items-center" key={tech}>
                <span>{tech}</span>
                {idx !== stackArr.length - 1 && (
                  <span className="inline-block size-2 rounded-full bg-gray-600"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
