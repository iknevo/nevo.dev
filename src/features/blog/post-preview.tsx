"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import TransitionLink from "@/src/components/transition-link";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetPost } from "@/src/features/admin/blog/api/use-get-post";
import Preview from "@/src/features/code-editor/preview";

interface Props {
  id: string;
}

export default function PostPreview({ id }: Props) {
  const { data: post, isLoading } = useGetPost(id);
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="mx-auto max-w-400 px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-16 selection:!bg-primary select-text">
      <TransitionLink
        back
        href="/"
        className="group mb-10 inline-flex h-12 items-center gap-2 sm:mb-14"
      >
        <ArrowLeft className="group-hover:text-primary transition-all duration-300 group-hover:-translate-x-1" />
        Back
      </TransitionLink>

      <div className="mx-auto md:max-w-[80%]">
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="size-16 animate-spin text-gray-500 sm:size-20" />
          </div>
        ) : !post ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-muted-foreground text-center text-2xl sm:text-3xl">
              Blog post not found <span className="text-primary">!</span>
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6 sm:space-y-8">
              <div className="border-accent/20 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
                <h1 className="text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
                  {post.title}
                </h1>
                <p className="text-sm text-white/60 sm:text-base">
                  {post.readingTime}
                </p>
              </div>

              <p className="text-lg text-white/90 sm:text-xl">{post.summary}</p>

              {post.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg dark">
                  {!loaded && <Skeleton className="absolute inset-0" />}
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    onLoadingComplete={() => setLoaded(true)}
                    priority
                  />
                  )
                </div>
              )}
            </div>

            <div className="dark mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-sm text-xs font-semibold sm:text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <Preview
              doc={post.doc}
              className="mt-8 max-w-full overflow-x-auto border-0 sm:mt-12"
            />
          </>
        )}
      </div>
    </section>
  );
}
