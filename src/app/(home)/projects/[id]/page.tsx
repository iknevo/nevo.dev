import ProjectDetails from "@/src/components/project-details";
import { notFound } from "next/navigation";

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
