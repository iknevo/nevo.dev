"use client";

import { XIcon } from "lucide-react";
import * as React from "react";
import { forwardRef, useState } from "react";

import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";

type InputTagsProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value: string[];
  onChange: (value: string[]) => void;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, className, ...props }, ref) => {
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
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            className={`${className ?? ""}`}
            {...props}
          />
        </div>

        <div className="min-h-8">
          {value.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {value.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="flex items-center gap-1 rounded-sm"
                  onClick={() => removeTag(item)}
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    className="inline-flex h-3 w-3 items-center justify-center"
                    onClick={() => removeTag(item)}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
);

InputTags.displayName = "InputTags";
