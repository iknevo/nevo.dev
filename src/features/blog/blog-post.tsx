import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

import TransitionLink from "@/src/components/transition-link";
import { BLOG_SOURCES } from "@/src/definitions/blog-validation";
import { PostResponse } from "@/src/types";

interface Props {
  post: PostResponse;
}

const linkClassName = "border-accent/20 block w-full border-b last:border-b-0";

export default function BlogPost({ post }: Props) {
  if (post.externalUrl) {
    const source = BLOG_SOURCES.find((option) => option.value === post.source)?.label;
    return (
      <a
        href={post.externalUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClassName}
      >
        <PostRow
          title={post.title}
          meta={
            <>
              {format(post.createdAt, "dd MMM yyyy")} - {source ?? "Elsewhere"}
              <ArrowUpRight className="ml-1 inline size-4 align-text-top" />
            </>
          }
        />
      </a>
    );
  }

  return (
    <TransitionLink href={`/blog/post/${post.slug}`} className={linkClassName}>
      <PostRow
        title={post.title}
        meta={
          <>
            {format(post.createdAt, "dd MMM yyyy")} - {post.readingTime}
          </>
        }
      />
    </TransitionLink>
  );
}

function PostRow({ title, meta }: { title: string; meta: React.ReactNode }) {
  return (
    <article className="group w-full transition-colors duration-200">
      <div className="flex flex-col gap-3 px-2 py-4 sm:px-4 sm:py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="from-primary bg-linear-to-r from-50% to-white to-50% bg-size-[200%] bg-clip-text bg-right text-xl font-bold text-transparent transition-all duration-700 group-hover:bg-left sm:text-2xl lg:text-3xl">
            {title}
          </h2>

          <time className="text-sm whitespace-nowrap text-white/60 transition-colors duration-300 group-hover:text-white sm:text-base">
            {meta}
          </time>
        </div>
      </div>
    </article>
  );
}
