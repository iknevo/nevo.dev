"use client";

import TransitionLink from "@/src/components/transition-link";
import { useGetPosts } from "@/src/features/admin/blog/api/use-get-posts";
import { ArrowLeft, Loader2 } from "lucide-react";
import BlogPost from "./blog-post";

export default function BlogsPage() {
  const { data: posts = [], isLoading } = useGetPosts();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-14 animate-spin text-gray-500 sm:size-20" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-16">
      <TransitionLink
        back
        href="/"
        className="group mb-10 inline-flex h-12 items-center gap-2 sm:mb-14"
      >
        <ArrowLeft className="group-hover:text-primary transition-all duration-300 group-hover:-translate-x-1" />
        Back
      </TransitionLink>

      <div className="mx-auto max-w-[1000px]">
        <div className="border-accent/20 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
            My Blog
          </h1>
          <p className="max-w-md text-base text-white/60">
            Here I write whatever I want whenever I want.
          </p>
        </div>

        {posts.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-xl sm:text-2xl">
            There&apos;s no blog posts added yet
          </p>
        )}

        <div className="flex flex-col md:mt-8">
          {posts.map((post) => (
            <BlogPost post={post} key={post._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
