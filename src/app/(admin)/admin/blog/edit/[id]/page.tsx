import EditBlogSection from "@/src/features/admin/blog/edit-blog/edit-blog-section";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "EDIT BLOG"
};

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();
  return <EditBlogSection id={id} />;
}
