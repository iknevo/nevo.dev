"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";

import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

type Props = {
  value: string | File;
  label?: string;
  fit?: "cover" | "contain";
  className?: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function nameFromUrl(url: string) {
  return url.split("?")[0].split("/").filter(Boolean).pop() ?? "";
}

export default function ImagePreview({
  value,
  label = "Current image",
  fit = "cover",
  className,
}: Props) {
  const isFile = value instanceof File;
  const src = useMemo(() => {
    if (value instanceof File) return value.size > 0 ? URL.createObjectURL(value) : null;
    return value.trim() || null;
  }, [value]);

  useEffect(() => {
    if (!src?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(src);
  }, [src]);

  if (!src) return null;

  const objectClassName = fit === "cover" ? "object-cover" : "object-contain";
  const alt = isFile ? value.name || label : label;
  const detail = isFile
    ? `${value.name || "selected file"} · ${formatSize(value.size)}`
    : nameFromUrl(value);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="border-input bg-muted/40 relative h-44 w-full overflow-hidden rounded-lg border sm:h-52">
        {isFile ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: object URLs are not handled by next/image
          <img
            src={src}
            alt={alt}
            className={cn("absolute inset-0 h-full w-full", objectClassName)}
          />
        ) : (
          <Image
            src={value}
            alt={alt}
            fill
            sizes="(max-width: 639px) 100vw, 512px"
            className={objectClassName}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground flex shrink-0 items-center gap-1.5">
          {isFile ? <Badge variant="secondary">New file</Badge> : label}
        </span>
        {detail && (
          <span className="text-muted-foreground min-w-0 truncate text-right">{detail}</span>
        )}
      </div>
    </div>
  );
}
