"use client";

import { useGSAP } from "@gsap/react";
import { format } from "date-fns";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader2, PenLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SectionTitle from "@/src/components/section-title";
import TransitionLink from "@/src/components/transition-link";
import { Button } from "@/src/components/ui/button";

import { useGetPosts } from "./api/use-get-posts";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BlogSection() {
  const { data: posts = [], isLoading } = useGetPosts();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-20 animate-spin text-gray-500" />
      </div>
    );

  return (
    <section>
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="My Blog" className="mb-0" />
          <Button
            className="dark flex items-center justify-center text-sm font-semibold md:text-lg"
            variant={"outline"}
            asChild
          >
            <Link href="/admin/blog/add">ADD BLOG</Link>
          </Button>
        </div>
      </div>

      {posts.length === 0 && (
        <p className="dark text-muted-foreground py-10 text-center text-3xl">
          There&apos;s no blog posts added yet
        </p>
      )}

      <div className="grid gap-2">
        {posts.map((post) => (
          <div
            className="experience-item flex items-center justify-between"
            key={post._id}
          >
            <TransitionLink href={`/blog/post/${post.slug}`}>
              <div>
                <p className="cursor mt-3.5 mb-2.5 text-2xl leading-none md:text-4xl">
                  {post.title}
                </p>
                <p className="cursor text-sm text-white/80 md:text-lg">
                  {format(post.createdAt, "dd MMMM, yyyy")}{" "}
                  {post?.readingTime && "/ " + post.readingTime}
                </p>
              </div>
            </TransitionLink>
            <button
              className="no-cursor cursor-none"
              onClick={() => router.push(`/admin/blog/edit/${post._id}`)}
            >
              <PenLine className="cursor size-7 md:size-8" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
