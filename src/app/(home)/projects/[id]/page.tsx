import { notFound } from "next/navigation";

import ProjectDetails from "@/src/components/project-details";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  return <ProjectDetails id={id} />;
}
