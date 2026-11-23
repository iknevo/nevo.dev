"use client";

import { Upload } from "lucide-react";
import { type DragEvent, type Ref, useState } from "react";

import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL, formatBytes } from "@/src/definitions/upload";
import { cn } from "@/src/lib/utils";

type Props = {
  accept: string;
  onFile: (file: File) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  maxBytes?: number;
  id?: string;
  name?: string;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: () => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
};

function matchesAccept(file: File, accept: string) {
  return accept.split(",").some((rule) => {
    const type = rule.trim();
    if (type.endsWith("/*")) return file.type.startsWith(type.slice(0, -1));
    if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type.toLowerCase());
    return file.type === type;
  });
}

export default function FileDropzone({
  accept,
  onFile,
  onError,
  disabled,
  label = "Drop a file or",
  hint,
  maxBytes = MAX_UPLOAD_BYTES,
  id,
  name,
  inputRef,
  onBlur,
  className,
  ...aria
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const maxLabel = maxBytes === MAX_UPLOAD_BYTES ? MAX_UPLOAD_LABEL : formatBytes(maxBytes);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!matchesAccept(file, accept)) {
      onError?.("This file type isn't supported.");
      return;
    }
    if (file.size > maxBytes) {
      onError?.(`File is too large. The limit is ${maxLabel}.`);
      return;
    }
    onFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <label
      data-dragging={isDragging || undefined}
      data-disabled={disabled || undefined}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={cn(
        "group flex min-h-20 cursor-pointer items-center gap-3 rounded-md border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 transition-colors",
        "hover:border-white/30 hover:bg-white/[0.04]",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "data-[dragging]:border-primary data-[dragging]:bg-primary/5",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        aria["aria-invalid"] && "border-destructive/60",
        className
      )}
    >
      <span className="bg-muted text-muted-foreground group-data-[dragging]:text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
        <Upload className="size-4" />
      </span>
      <span className="min-w-0 text-sm">
        <span className="block">
          {label}{" "}
          <span className="text-primary underline-offset-4 group-hover:underline">browse</span>
        </span>
        <span className="text-muted-foreground block text-xs">
          {hint ? `${hint} · ` : ""}max {maxLabel}
        </span>
      </span>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        disabled={disabled}
        onBlur={onBlur}
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
        {...aria}
      />
    </label>
  );
}
