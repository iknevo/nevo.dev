import { Metadata } from "next";
import { notFound } from "next/navigation";

import PostPreview from "@/src/features/blog/post-preview";
import { api } from "@/src/lib/hono";
import { PostResponse } from "@/src/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await api.blog[":id"].$get({
    param: { id }
  });
  if (!res.ok) throw new Error("Failed to fetch post");
  const { data }: { data: PostResponse } = await res.json();
  console.log(data);

  if (!id) {
    return {
      title: "Post Not Found"
    };
  }

  return {
    title: `${data.title}`,
    description: `${data.summary}`
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  return <PostPreview id={id} />;
}
