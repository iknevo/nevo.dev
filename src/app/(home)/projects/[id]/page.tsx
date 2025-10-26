import ProjectDetails from "@/src/components/project-details";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  return <ProjectDetails id={id} />;
};

export default Page;
