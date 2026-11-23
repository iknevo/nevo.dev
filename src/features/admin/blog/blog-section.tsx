"use client";

import { format } from "date-fns";
import { EyeOff, PenLine } from "lucide-react";
import Link from "next/link";

import AdminSectionButton from "@/src/components/admin-section-button";
import TransitionLink from "@/src/components/transition-link";
import AdminSection, {
  AdminEmptyState,
  AdminRefreshError,
  AdminSectionError,
  AdminSectionLoading,
} from "@/src/features/admin/shared/admin-section";
import { cn } from "@/src/lib/utils";

import { useGetPosts } from "./api/use-get-posts";

export default function BlogSection() {
  const { data: posts, isLoading, isError, refetch } = useGetPosts(true);

  return (
    <AdminSection
      title="Blog"
      action={
        <AdminSectionButton asChild>
          <Link href="/admin/blog/add">New post</Link>
        </AdminSectionButton>
      }
    >
      {isLoading ? (
        <AdminSectionLoading />
      ) : isError && !posts ? (
        <AdminSectionError message="We couldn't load your posts." onRetry={() => refetch()} />
      ) : (
        <>
          {isError && (
            <AdminRefreshError message="Couldn't refresh the posts." onRetry={() => refetch()} />
          )}
          {!posts?.length && <AdminEmptyState>No posts yet.</AdminEmptyState>}

          <div className="grid gap-2">
            {posts?.map((post) => (
              <div
                className={cn(
                  "experience-item flex items-center justify-between gap-4",
                  post.hide && "opacity-60"
                )}
                key={post._id}
              >
                <TransitionLink
                  href={`/blog/post/${post.slug}${post.hide ? "?preview=1" : ""}`}
                  className="min-w-0"
                >
                  <p className="cursor mt-3.5 mb-2.5 text-lg md:text-4xl">{post.title}</p>
                  <p className="cursor flex items-center gap-2 text-sm text-white/80 md:text-lg">
                    {post.hide && (
                      <span className="inline-flex items-center gap-1 rounded-sm border border-white/15 px-1.5 py-0.5 text-xs tracking-wide uppercase">
                        <EyeOff className="size-3" />
                        Hidden
                      </span>
                    )}
                    {format(post.createdAt, "dd MMMM, yyyy")}
                    {post?.readingTime && ` / ${post.readingTime}`}
                  </p>
                </TransitionLink>
                <Link
                  href={`/admin/blog/edit/${post._id}`}
                  aria-label={`Edit ${post.title}`}
                  className="hover:text-primary shrink-0 rounded-md p-2 transition-colors"
                >
                  <PenLine className="cursor size-7 md:size-8" />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminSection>
  );
}
