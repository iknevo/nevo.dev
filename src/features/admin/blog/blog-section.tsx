"use client";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { useGSAP } from "@gsap/react";
import { format } from "date-fns";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader2, PenLine } from "lucide-react";
import Link from "next/link";
import { useGetPosts } from "./api/use-get-posts";
import { useRouter } from "next/navigation";
import TransitionLink from "@/src/components/transition-link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BlogSection() {
  const { data: posts = [], isLoading } = useGetPosts();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin size-20 text-gray-500" />
      </div>
    );

  return (
    <section>
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <SectionTitle title="My Blog" className="mb-0" />
          <Button
            className="flex items-center justify-center text-lg font-semibold dark"
            variant={"outline"}
            asChild
          >
            <Link href="/admin/blog/add">ADD BLOG</Link>
          </Button>
        </div>
      </div>

      {posts.length === 0 && (
        <p className="py-10 text-center dark text-muted-foreground text-3xl">
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
                <p className="text-3xl md:text-4xl cursor leading-none mt-3.5 mb-2.5">
                  {post.title}
                </p>
                <p className="text-lg text-white/80 cursor">
                  {format(post.createdAt, "dd MMMM, yyyy")}{" "}
                  {post?.readingTime && "/ " + post.readingTime}
                </p>
              </div>
            </TransitionLink>
            <button
              className="no-cursor cursor-none"
              onClick={() => router.push(`/admin/blog/edit/${post._id}`)}
            >
              <PenLine className="size-8 cursor" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
