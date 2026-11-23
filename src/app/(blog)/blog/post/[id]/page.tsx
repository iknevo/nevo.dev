import { Metadata } from "next";
import { notFound } from "next/navigation";

import PostPreview from "@/src/features/blog/post-preview";
import { serverFetch } from "@/src/lib/server-api";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "1";
  if (!id) {
    return {
      title: "Post Not Found",
    };
  }

  try {
    const { data } = await serverFetch(
      isPreview ? `/api/blog/${id}?withHidden=true` : `/api/blog/${id}`,
      { withCookies: isPreview }
    );
    return {
      title: `${data.title}`,
      description: `${data.summary}`,
      alternates: {
        canonical: `/blog/post/${id}`,
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  return <PostPreview id={id} />;
}
