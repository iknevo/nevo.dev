"use client";

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
import { LoaderSmall } from "@/src/components/loader-small";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
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

  if (isLoading && items.length === 0)
    return (
      <div className="flex justify-center">
        <LoaderSmall className="py-20" />
      </div>
    );

  if (isError && items.length === 0) {
    return (
      <section>
        <div className="container pb-10">
          <div className="mb-10 flex items-center justify-between">
            <SectionTitle title="Experience" className="mb-0" />
            <AdminSectionButton onClick={onOpen}>New Experience</AdminSectionButton>
          </div>
          <div className="dark flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center">
            <p className="text-muted-foreground">We couldn&apos;t load your experience.</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </div>
      </section>
    );
  }

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

  return (
    <section>
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="Experience" className="mb-0" />
          <AdminSectionButton onClick={onOpen}>New Experience</AdminSectionButton>
        </div>

        {isError && (
          <div className="dark mb-6 flex items-center justify-between gap-4 rounded-md border border-dashed px-4 py-3 text-sm">
            <p className="text-muted-foreground">Couldn&apos;t refresh the experience list.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {items.length === 0 && (
          <p className="dark text-muted-foreground py-10 text-center text-3xl">
            There&apos;s no experience added yet
          </p>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                    <span className="no-cursor cursor-none rounded-sm p-1 text-white/50 transition-colors group-hover:text-white">
                      <PenLine className="cursor size-7 md:size-8" />
                    </span>
                  </button>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}
