import { Metadata } from "next";

import ProjectDetails from "@/src/components/project-details";
import { getProject } from "@/src/lib/server-api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await getProject(id);
    return {
      title: project.name,
      description: project.description,
      alternates: {
        canonical: `/projects/${project.slug}`,
      },
    };
  } catch {
    return {
      title: "Project Not Found",
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ProjectDetails key={id} id={id} />;
}
