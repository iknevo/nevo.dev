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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import AdminSectionButton from "@/src/components/admin-section-button";
import { LoaderSmall } from "@/src/components/loader-small";
import SectionTitle from "@/src/components/section-title";
import { useSyncedState } from "@/src/hooks/useSyncedState";
import { cn } from "@/src/lib/utils";

import { useGetStack } from "./api/use-get-stack";
import { useNewStack } from "./state/use-new-stack";
import { useOpenStack } from "./state/use-open-stack";

type StackItem = {
  _id: string;
  name: string;
  icon: string;
  type: string;
  hide: boolean;
  sortIndex: number;
};

type StackGroup = {
  type: string;
  items: StackItem[];
};

export default function StackSection() {
  const { isLoading } = useGetStack(true);
  const { onOpen } = useNewStack();
  const { onOpen: onOpenEdit } = useOpenStack();
  const queryClient = useQueryClient();
  const { mutate: reorder } = useReorder(["stack", true]);
  const [localStack, setLocalStack] = useSyncedState<StackGroup[]>(["stack", true], []);

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

  function handleDragEnd(type: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const group = localStack.find((g) => g.type === type);
    if (!group) return;
    const oldIndex = group.items.findIndex((item) => item._id === active.id);
    const newIndex = group.items.findIndex((item) => item._id === over.id);
    const reorderedIds = arrayMove(group.items, oldIndex, newIndex).map((item) => item._id);

    setLocalStack((prev) => {
      const newStack = prev.map((g) =>
        g.type === type ? { ...g, items: arrayMove(g.items, oldIndex, newIndex) } : g
      );
      queryClient.setQueryData(["stack", true], newStack);
      return newStack;
    });

    reorder({ ids: reorderedIds });
  }

  return (
    <section id="my-stack">
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="STACK" className="mb-0" />
          <AdminSectionButton onClick={onOpen}>New Skill</AdminSectionButton>
        </div>

        {localStack.length === 0 && (
          <p className="dark text-muted-foreground py-10 text-center text-3xl">
            There&apos;s no stack added yet
          </p>
        )}

        <div className="space-y-20">
          {localStack.map(({ type, items }) => (
            <div className="flex flex-col gap-10" key={type}>
              <h1 className="text-center text-3xl leading-none text-white/80 uppercase md:text-5xl">
                {type}
              </h1>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(type, event)}
              >
                <SortableContext
                  items={items.map((item) => item._id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-3 items-center gap-5 md:grid-cols-3 md:gap-10 lg:grid-cols-5">
                    {items.map((item) => (
                      <SortableItem key={item._id} id={item._id} variant="grid">
                        <div
                          className={cn(
                            "project-item group cursor pt-5 leading-none transition-all md:group-hover/projects:opacity-30 md:hover:opacity-100!",
                            item.hide && "opacity-50 grayscale"
                          )}
                          onClick={() => onOpenEdit(item._id)}
                        >
                          <div className="mx-auto flex size-16 items-center justify-center md:size-25">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={100}
                              height={100}
                              quality={100}
                              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="mt-3 text-center text-sm md:mt-5 md:text-lg">
                            <p className="from-primary bg-linear-to-r from-50% to-white to-50% bg-size-[200%] bg-clip-text bg-right text-transparent transition-all duration-700 group-hover:bg-left">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
