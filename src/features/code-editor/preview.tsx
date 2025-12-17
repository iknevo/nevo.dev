import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/pojoaque.css";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import gfm from "remark-gfm";

import { cn } from "@/src/lib/utils";

interface Props {
  className?: string;
  doc: string;
}
type PreProps = React.HTMLAttributes<HTMLPreElement>;

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), ["style"], ["align"]],
    p: [...(defaultSchema.attributes?.p ?? []), ["style"], ["align"]],
    span: [...(defaultSchema.attributes?.span ?? []), ["style"]]
  }
};

function CustomPre(props: PreProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement | null>(null);

  const handleCopy = async () => {
    try {
      const text = preRef.current?.textContent ?? "";
      if (!text.trim()) return;

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="relative">
      <button
        className="no-cursor absolute top-2 right-2 flex aspect-square items-center justify-center rounded-md border border-white/20 p-2 transition-colors duration-200 hover:text-white/40"
        type="button"
        onClick={handleCopy}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      <pre
        {...props}
        ref={preRef}
        className={cn(
          "overflow-x-auto rounded-xl px-4 py-4 !pt-10 text-[0.7rem] leading-relaxed sm:px-6 sm:py-5 sm:text-sm md:!pt-0 md:text-[0.95rem]",
          props.className
        )}
      />
    </div>
  );
}

export default function Preview({ className, doc }: Props) {
  return (
    <div
      className={cn(
        "markdown-body h-full overflow-hidden rounded-sm border-1 border-white/10 !bg-transparent p-3",
        className
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
                className="my-4 rounded"
              />
            );
          },
          pre: CustomPre
        }}
      >
        {doc}
      </Markdown>
    </div>
  );
}
