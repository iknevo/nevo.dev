"use client";

import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";

import { useDragCancel } from "./use-sortable-drag";

export default function DragCancel() {
  const [isDragging, setIsDragging] = useState(false);

  useDndMonitor({
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
    onDragCancel: () => setIsDragging(false),
  });

  useDragCancel(isDragging);

  return null;
}
