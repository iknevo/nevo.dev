"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
  variant?: "list" | "grid";
}

export default function SortableItem({ id, children, className, variant = "list" }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (variant === "grid") {
    return (
      <div ref={setNodeRef} style={style} className={className}>
        <div className="relative">
          <button
            {...attributes}
            {...listeners}
            className="absolute -top-1 -left-1 z-10 cursor-grab touch-none rounded-full bg-black/50 p-1 text-white/40 hover:text-white/70"
            aria-label="Reorder item"
            aria-grabbed={isDragging}
          >
            <GripVertical className="size-4" />
          </button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-white/40 hover:text-white/70"
          aria-label="Reorder item"
          aria-grabbed={isDragging}
        >
          <GripVertical className="size-5" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
