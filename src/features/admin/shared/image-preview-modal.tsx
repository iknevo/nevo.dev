"use client";

import { ExternalLink, ImageUpscale } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";

type Props = {
  value: string | File;
  fit?: "cover" | "contain";
  disabled?: boolean;
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

export default function ImagePreviewModal({ value, fit = "cover", disabled, className }: Props) {
  const [open, setOpen] = useState(false);
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
  const alt = isFile ? value.name || "Selected image" : nameFromUrl(value) || "Current image";
  const detail = isFile
    ? `${value.name || "selected file"} · ${formatSize(value.size)}`
    : nameFromUrl(value);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              aria-label={`Preview ${alt}`}
              className={cn("text-muted-foreground hover:text-foreground", className)}
            >
              <ImageUpscale />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Preview image</TooltipContent>
      </Tooltip>
      <DialogContent
        className="dark overflow-hidden rounded-none p-2 sm:max-w-3xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">{detail}</DialogDescription>
        <div className="group relative h-[60vh] max-h-[80vh] w-full overflow-hidden">
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
              sizes="(max-width: 639px) 100vw, 768px"
              className={objectClassName}
            />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={src}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Open image in a new tab"
                className="hover:bg-primary absolute top-2 right-2 inline-flex size-12 items-center justify-center bg-gray-950/70 text-white opacity-0 transition-all group-hover:opacity-100 hover:text-white"
              >
                <ExternalLink />
              </a>
            </TooltipTrigger>
            <TooltipContent>Open image in a new tab</TooltipContent>
          </Tooltip>
        </div>
      </DialogContent>
    </Dialog>
  );
}
