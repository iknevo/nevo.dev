"use client";

import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { type SortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

export type DropSide = "before" | "after";

export const keepInPlace: SortingStrategy = () => null;

function suppressNextContextMenu() {
  const block = (event: Event) => {
    event.preventDefault();
    cleanup();
  };
  const cleanup = () => {
    window.removeEventListener("contextmenu", block, true);
    window.removeEventListener("mousedown", cleanup, true);
  };
  window.addEventListener("contextmenu", block, true);
  window.addEventListener("mousedown", cleanup, true);
}

export function useDragCancel(isDragging: boolean) {
  useEffect(() => {
    if (!isDragging) return;

    const cancelDrag = () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape", bubbles: true }));
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      suppressNextContextMenu();
      cancelDrag();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      cancelDrag();
    };

    window.addEventListener("mousedown", handleMouseDown, true);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isDragging]);
}

type Options = {
  ids: string[];
  onMove: (oldIndex: number, newIndex: number) => void;
};

export function useSortableDrag({ ids, onMove }: Options) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useDragCancel(activeId !== null);

  const activeIndex = activeId ? ids.indexOf(activeId) : -1;
  const overIndex = overId ? ids.indexOf(overId) : -1;

  const reset = () => {
    setActiveId(null);
    setOverId(null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    reset();
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onMove(oldIndex, newIndex);
  };

  const getDropSide = (id: string): DropSide | null => {
    const index = ids.indexOf(id);
    if (activeIndex === -1 || index !== overIndex || index === activeIndex) return null;
    return overIndex > activeIndex ? "after" : "before";
  };

  return {
    activeId,
    getDropSide,
    contextProps: {
      sensors,
      collisionDetection: closestCenter,
      onDragStart: ({ active }: DragStartEvent) => setActiveId(String(active.id)),
      onDragOver: ({ over }: DragOverEvent) => setOverId(over ? String(over.id) : null),
      onDragEnd: handleDragEnd,
      onDragCancel: reset,
    },
  };
}
