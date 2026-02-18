import { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetails from "@/src/components/project-details";
import { api } from "@/src/lib/hono";
import { ProjectResponse } from "@/src/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await api.projects[":id"].$get({
    param: { id }
  });
  if (!res.ok) throw new Error("Failed to fetch project");
  const { data }: { data: ProjectResponse } = await res.json();

  if (!id) {
    return {
      title: "Project Not Found"
    };
  }

  return {
    title: `${data.name}`,
    description: `${data.description}`
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  return <ProjectDetails id={id} />;
}
