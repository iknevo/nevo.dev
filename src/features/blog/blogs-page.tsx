"use client";

import TransitionLink from "@/src/components/transition-link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetPosts } from "../admin/blog/api/use-get-posts";
import BlogPost from "./blog-post";

export default function BlogsPage() {
  const { data: posts = [], isLoading } = useGetPosts();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin -mt-40 size-20 text-gray-500" />
      </div>
    );

  return (
    <section className="pt-5 pb-14 md:px-20 h-screen">
      <TransitionLink
        back
        href="/"
        className="mb-16 inline-flex gap-2 items-center group h-12"
      >
        <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
        Back
      </TransitionLink>

      <div className="px-25">
        <div className="flex items-center justify-between border-b pb-5 border-accent/20">
          <h1 className="text-4xl font-semibold">My Blog</h1>
          <p className="text-xl font-semibold text-white/60">
            Here I write whatever I want whenever I want.
          </p>
        </div>

        {posts.length === 0 && (
          <p className="py-10 text-center dark text-muted-foreground text-3xl">
            There&apos;s no blog posts added yet
          </p>
        )}
        <div className="flex flex-col">
          {posts.map((post) => (
            <BlogPost post={post} key={post._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
