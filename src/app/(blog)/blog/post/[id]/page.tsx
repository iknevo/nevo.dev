import PostPreview from "@/src/features/blog/post-preview";
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
  return <PostPreview id={id} />;
}
