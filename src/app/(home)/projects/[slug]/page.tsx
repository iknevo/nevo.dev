import ProjectDetails from "@/src/components/project-details";
import { PROJECTS } from "@/src/lib/data";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const generateStaticParams = async () => {
  return PROJECTS.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const project = PROJECTS.find((project) => project.slug === slug);

  return {
    title: `${project?.title}`,
    description: project?.description,
  } as Metadata;
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const project = PROJECTS.find((project) => project.slug === slug);

  if (!project) {
    return notFound();
  }

  return <ProjectDetails project={project} />;
};

export default Page;
