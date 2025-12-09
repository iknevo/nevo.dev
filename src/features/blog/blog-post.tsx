import TransitionLink from "@/src/components/transition-link";
import { PostResponse } from "@/src/types";
import { format } from "date-fns";

interface Props {
  post: PostResponse;
}
export default function BlogPost({ post }: Props) {
  {
  }
  return (
    <TransitionLink
      href={`/blog/post/${post.slug}`}
      className="w-full border-b border-accent/20 last:border-b-0"
    >
      <article className="group w-full gap-2 transition-colors duration-200">
        <div className="flex flex-col justify-between gap-2 p-4">
          <div className="flex justify-between">
            <h1 className="text-3xl flex gap-4 font-bold transition-all duration-700 bg-linear-to-r from-primary to-white from-50% to-50% bg-size-[200%] bg-right bg-clip-text text-transparent group-hover:bg-left">
              {post.title}
            </h1>
            <div className="flex items-center gap-2">
              <time className="text-xl text-white/60 transition-colors duration-300 group-hover:text-white">
                {format(post.createdAt, "dd MMMM, yyyy")}
              </time>
            </div>
          </div>
        </div>
      </article>
    </TransitionLink>
  );
}
