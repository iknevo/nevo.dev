import React, { useRef, useState } from "react";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/pojoaque.css";
import { cn } from "@/src/lib/utils";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

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
    span: [...(defaultSchema.attributes?.span ?? []), ["style"]],
  },
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
        className="no-cursor absolute p-2 rounded-md top-2 right-2 aspect-square flex items-center justify-center border border-white/20 transition-colors duration-200 hover:text-white/40"
        type="button"
        onClick={handleCopy}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      <pre {...props} ref={preRef} />
    </div>
  );
}

export default function Preview({ className, doc }: Props) {
  return (
    <div
      className={cn(
        "markdown-body h-full !bg-transparent p-3 border-1 border-white/10 rounded-sm overflow-hidden",
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
          pre: CustomPre,
        }}
      >
        {doc}
      </Markdown>
    </div>
  );
}
