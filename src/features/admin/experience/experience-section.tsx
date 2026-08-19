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
import { useSyncedState } from "@/src/hooks/useSyncedState";
import { cn } from "@/src/lib/utils";
import { ExperienceResponse } from "@/src/types";

import { useGetExperience } from "./api/use-get-experience";
import { useNewExperience } from "./state/use-new-experience";
import { useOpenExperience } from "./state/use-open-experience";

export default function ExperienceSection() {
  const { isLoading } = useGetExperience(true);
  const { onOpen } = useNewExperience();
  const { onOpen: onOpenEdit } = useOpenExperience();
  const queryClient = useQueryClient();
  const { mutate: reorder } = useReorder(["experience"]);
  const [items, setItems] = useSyncedState<ExperienceResponse[]>(["experience"], []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading)
    return (
      <div className="flex justify-center">
        <LoaderSmall className="py-20" />
      </div>
    );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item._id === active.id);
    const newIndex = items.findIndex((item) => item._id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);
    queryClient.setQueryData(["experience"], newOrder);

    reorder({ ids: newOrder.map((item) => item._id) });
  }

  return (
    <section>
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="Experience" className="mb-0" />
          <AdminSectionButton onClick={onOpen}>New Experience</AdminSectionButton>
        </div>

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
                <SortableItem key={item._id} id={item._id}>
                  <div
                    className={cn(
                      "experience-item flex items-center justify-between",
                      item.hide && "opacity-50 grayscale"
                    )}
                    onClick={() => onOpenEdit(item._id)}
                  >
                    <div>
                      <p className="cursor text-white/80 md:text-xl">{item.company}</p>
                      <p className="cursor mt-3.5 mb-2.5 text-lg md:text-4xl">{item.title}</p>
                      <p className="cursor text-sm text-white/80 md:text-lg">
                        {item.startDate} - {item.endDate}
                      </p>
                    </div>
                    <button className="no-cursor cursor-none">
                      <PenLine className="cursor size-7 md:size-8" />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}
