import { Metadata } from "next";

import PostPreview from "@/src/features/blog/post-preview";
import { getPost } from "@/src/lib/server-api";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { preview } = await searchParams;
  try {
    const post = await getPost(id, preview === "1");
    return {
      title: post.title,
      description: post.summary,
      alternates: {
        canonical: `/blog/post/${post.slug}`,
      },
      ...(post.hide && { robots: { index: false, follow: false } }),
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <PostPreview id={id} />;
}
