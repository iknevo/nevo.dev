"use client";

import { XIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";

type InputTagsProps = Omit<React.ComponentPropsWithRef<"input">, "value" | "onChange"> & {
  value: string[];
  onChange: (value: string[]) => void;
};

export function InputTags({
  value,
  onChange,
  onBlur,
  className,
  disabled,
  ref,
  ...props
}: InputTagsProps) {
  const [tag, setTag] = useState("");

  const addTag = () => {
    const trimmed = tag.trim();
    if (!trimmed) return;

    const newDataPoints = new Set([...value, trimmed]);
    onChange(Array.from(newDataPoints));
    setTag("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <>
      <div className="flex">
        <Input
          ref={ref}
          value={tag}
          disabled={disabled}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={(e) => {
            addTag();
            onBlur?.(e);
          }}
          className={className}
          {...props}
        />
      </div>

      <div className="min-h-8">
        {value.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {value.map((item) => (
              <Badge key={item} variant="secondary" className="flex items-center gap-1 rounded-sm">
                <span>{item}</span>
                <button
                  type="button"
                  aria-label={`Remove tag ${item}`}
                  disabled={disabled}
                  className="hover:text-foreground inline-flex size-4 items-center justify-center rounded-xs disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => removeTag(item)}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
