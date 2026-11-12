"use client";

import { useLenis } from "lenis/react";
import { Expand } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import ImageLightbox from "@/src/components/image-lightbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
  children: ReactNode;
}

export default function ImageWithLightbox({ src, alt, className, children }: Props) {
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [isOpen, lenis]);

  return (
    <>
      <div className={cn("group relative overflow-hidden", className)}>
        {children}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label={`View ${alt} full screen`}
              className="hover:bg-primary absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center bg-gray-950/70 text-white opacity-100 transition-all hover:text-white lg:size-12 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <Expand />
            </button>
          </TooltipTrigger>
          <TooltipContent>View full screen</TooltipContent>
        </Tooltip>
      </div>

      <ImageLightbox src={src} alt={alt} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
