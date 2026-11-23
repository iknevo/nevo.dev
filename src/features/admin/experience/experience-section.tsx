"use client";

import DragCancel from "../shared/drag-cancel";
import SortableItem from "../shared/sortable-item";
import { useReorder } from "../shared/use-reorder";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { PenLine } from "lucide-react";

import AdminSectionButton from "@/src/components/admin-section-button";
import AdminSection, {
  AdminEmptyState,
  AdminRefreshError,
  AdminSectionError,
  AdminSectionLoading,
} from "@/src/features/admin/shared/admin-section";
import { useSyncedState } from "@/src/hooks/useSyncedState";
import { cn } from "@/src/lib/utils";
import { ExperienceResponse } from "@/src/types";

import { useGetExperience } from "./api/use-get-experience";
import { useNewExperience } from "./state/use-new-experience";
import { useOpenExperience } from "./state/use-open-experience";

export default function ExperienceSection() {
  const { isLoading, isError, refetch } = useGetExperience(true);
  const { onOpen } = useNewExperience();
  const { onOpen: onOpenEdit } = useOpenExperience();
  const queryClient = useQueryClient();
  const { mutate: reorder, isPending: isSavingOrder } = useReorder(["experience", true]);
  const [items, setItems] = useSyncedState<ExperienceResponse[]>(["experience", true], []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item._id === active.id);
    const newIndex = items.findIndex((item) => item._id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);
    queryClient.setQueryData(["experience", true], newOrder);

    reorder({ ids: newOrder.map((item) => item._id) });
  }

  const action = <AdminSectionButton onClick={onOpen}>New experience</AdminSectionButton>;

  if (isLoading && items.length === 0) {
    return (
      <AdminSection title="Experience" action={action}>
        <AdminSectionLoading />
      </AdminSection>
    );
  }

  if (isError && items.length === 0) {
    return (
      <AdminSection title="Experience" action={action}>
        <AdminSectionError message="We couldn't load your experience." onRetry={() => refetch()} />
      </AdminSection>
    );
  }

  return (
    <AdminSection title="Experience" action={action}>
      <div>
        {isError && (
          <AdminRefreshError
            message="Couldn't refresh the experience list."
            onRetry={() => refetch()}
          />
        )}

        {items.length === 0 && <AdminEmptyState>No experience yet.</AdminEmptyState>}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <DragCancel />
          <SortableContext
            items={items.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-6">
              {items.map((item) => (
                <SortableItem key={item._id} id={item._id} disabled={isSavingOrder}>
                  <button
                    type="button"
                    aria-label={`Edit ${item.company} experience`}
                    className={cn(
                      "experience-item group flex w-full items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
                      item.hide && "opacity-50 grayscale"
                    )}
                    onClick={() => onOpenEdit(item._id)}
                  >
                    <div>
                      <p className="text-white/80 md:text-xl">{item.company}</p>
                      <p className="mt-3.5 mb-2.5 text-lg md:text-4xl">{item.title}</p>
                      <p className="text-sm text-white/80 md:text-lg">
                        {item.startDate} - {item.endDate}
                      </p>
                      {item.hide && (
                        <span className="text-muted-foreground mt-2 block text-xs tracking-wider uppercase">
                          Hidden
                        </span>
                      )}
                    </div>
                    <span className="rounded-sm p-1 text-white/50 transition-colors group-hover:text-white">
                      <PenLine className="cursor size-7 md:size-8" />
                    </span>
                  </button>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </AdminSection>
  );
}
