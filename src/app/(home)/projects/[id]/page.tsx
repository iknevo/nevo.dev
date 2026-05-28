import { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetails from "@/src/components/project-details";
import { serverFetch } from "@/src/lib/server-api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: "Project Not Found"
    };
  }

  const { data } = await serverFetch(`/api/projects/${id}`);

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
