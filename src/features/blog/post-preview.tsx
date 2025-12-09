"use client";

import TransitionLink from "@/src/components/transition-link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetPost } from "../admin/blog/api/use-get-post";
import Preview from "../code-editor/preview";

interface Props {
  id: string;
}
export default function PostPreview({ id }: Props) {
  const { data: post, isLoading } = useGetPost(id);

  return (
    <section className="pt-5 pb-14 md:px-20">
      <TransitionLink
        back
        href="/"
        className="mb-16 inline-flex gap-2 items-center group h-12"
      >
        <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
        Back
      </TransitionLink>

      <div className="px-25">
        {isLoading ? (
          <div className="flex justify-center items-center py-10 min-h-[50vh]">
            <Loader2 className="animate-spin slide-up size-20 text-gray-500" />
          </div>
        ) : !post ? (
          <div className="flex justify-center items-center py-10 min-h-[50vh]">
            <p className="py-10 text-center dark slide-up text-muted-foreground text-3xl md:text-4xl">
              Blog post not found <span className="text-primary">!</span>
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-5 border-accent/20">
              <h1 className="text-4xl font-semibold">{post.title}</h1>
              <p className="text-xl font-semibold text-white/60">
                {post.readingTime}
              </p>
            </div>
            <p className="text-2xl">{post.summary}</p>
            <Preview doc={post.doc} className="border-0" />
          </div>
        )}
      </div>
    </section>
  );
}
