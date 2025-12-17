import TransitionLink from "@/src/components/transition-link";
import { PostResponse } from "@/src/types";
import { format } from "date-fns";

interface Props {
  post: PostResponse;
}

export default function BlogPost({ post }: Props) {
  return (
    <TransitionLink
      href={`/blog/post/${post.slug}`}
      className="border-accent/20 block w-full border-b last:border-b-0"
    >
      <article className="group w-full transition-colors duration-200">
        <div className="flex flex-col gap-3 px-2 py-4 sm:px-4 sm:py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="from-primary bg-linear-to-r from-50% to-white to-50% bg-size-[200%] bg-clip-text bg-right text-xl font-bold text-transparent transition-all duration-700 group-hover:bg-left sm:text-2xl lg:text-3xl">
              {post.title}
            </h2>

            <time className="text-sm whitespace-nowrap text-white/60 transition-colors duration-300 group-hover:text-white sm:text-base">
              {format(post.createdAt, "dd MMM yyyy")}
            </time>
          </div>
        </div>
      </article>
    </TransitionLink>
  );
}
