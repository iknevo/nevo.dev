"use client";

import Image from "next/image";

type Props = {
  value: string | File;
  label?: string;
};

export default function ImagePreview({ value, label = "Current image" }: Props) {
  if (value instanceof File) {
    if (value.size === 0) return null;
    return (
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">New file selected</p>
        <p className="text-sm">{value.name || "selected file"}</p>
      </div>
    );
  }

  if (!value.trim()) return null;

  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label} — select a file to replace it</p>
      <div className="relative h-24 w-40 overflow-hidden rounded-md border">
        <Image src={value} alt={label} fill sizes="160px" className="object-cover" />
      </div>
    </div>
  );
}
