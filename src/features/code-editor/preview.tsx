import React from "react";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/pojoaque.css";
import { cn } from "@/src/lib/utils";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import Image from "next/image";

interface Props {
  className?: string;
  doc: string;
}

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), ["style"], ["align"]],
    p: [...(defaultSchema.attributes?.p ?? []), ["style"], ["align"]],
    span: [...(defaultSchema.attributes?.span ?? []), ["style"]],
  },
};

export default function Preview({ className, doc }: Props) {
  return (
    <div
      className={cn(
        "markdown-body h-full !bg-transparent p-3 border-1 border-white/10",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[gfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeHighlight]}
        components={{
          img: ({ src, alt = "" }) => {
            if (!src) return null;
            return (
              <Image
                src={src.toString()}
                alt={alt}
                width={800}
                height={600}
                className="rounded my-4"
              />
            );
          },
        }}
      >
        {doc}
      </Markdown>
    </div>
  );
}
