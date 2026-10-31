"use client";

import { X } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";

interface Props {
  src: string;
  alt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImageLightbox({ src, alt, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 inset-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center gap-0 rounded-none border-0 bg-black/95 p-0 shadow-none duration-200 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">
          Full-screen preview of {alt}. Press Escape or click outside the image to close.
        </DialogDescription>

        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          quality={100}
          className="object-contain p-4 sm:p-8"
        />

        <DialogClose className="hover:bg-primary focus-visible:outline-primary absolute top-4 right-4 inline-flex size-10 items-center justify-center bg-gray-950/70 text-white outline-offset-4 transition-all duration-200 hover:text-white focus-visible:outline-2 sm:top-6 sm:right-6">
          <X className="size-5" />
          <span className="sr-only">Close image preview</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
