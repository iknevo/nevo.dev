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
import AdminSection, {
  AdminEmptyState,
  AdminRefreshError,
  AdminSectionError,
  AdminSectionLoading,
} from "@/src/features/admin/shared/admin-section";
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

const stackTypeLabels: Record<string, string> = {
  frontend: "Front-End",
  backend: "Back-End",
  mobile: "Mobile",
  testing: "Testing",
  tools: "Tools",
  studying: "Studying",
};

export default function StackSection() {
  const { isLoading, isError, refetch } = useGetStack(true);
  const { onOpen } = useNewStack();
  const { onOpen: onOpenEdit } = useOpenStack();
  const queryClient = useQueryClient();
  const { mutate: reorder, isPending: isSavingOrder } = useReorder(["stack", true]);
  const [localStack, setLocalStack] = useSyncedState<StackGroup[]>(["stack", true], []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const action = <AdminSectionButton onClick={onOpen}>New skill</AdminSectionButton>;

  if (isLoading && localStack.length === 0) {
    return (
      <AdminSection title="Stack" action={action}>
        <AdminSectionLoading />
      </AdminSection>
    );
  }

  if (isError && localStack.length === 0) {
    return (
      <AdminSection title="Stack" action={action}>
        <AdminSectionError message="We couldn't load your stack." onRetry={() => refetch()} />
      </AdminSection>
    );
  }

  return (
    <AdminSection title="Stack" action={action} id="my-stack">
      <div>
        {isError && (
          <AdminRefreshError message="Couldn't refresh the stack." onRetry={() => refetch()} />
        )}

        {localStack.length === 0 && <AdminEmptyState>No skills yet.</AdminEmptyState>}

        <div className="space-y-20">
          {localStack.map(({ type, items }) => (
            <div className="flex flex-col gap-10" key={type}>
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-center text-2xl tracking-wide text-white/80 uppercase md:text-4xl">
                  {stackTypeLabels[type] ?? type}
                </h2>
              </div>

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
                      <SortableItem
                        key={item._id}
                        id={item._id}
                        variant="grid"
                        disabled={isSavingOrder}
                      >
                        <button
                          type="button"
                          aria-label={`Edit ${item.name}`}
                          className={cn(
                            "project-item group cursor flex w-full flex-col items-center pt-2 leading-none transition-opacity hover:opacity-100 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
                            item.hide && "opacity-50 grayscale"
                          )}
                          onClick={() => onOpenEdit(item._id)}
                        >
                          <div className="flex size-16 items-center justify-center md:size-25">
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
                            {item.hide && (
                              <span className="text-muted-foreground mt-2 block text-[10px] tracking-wider uppercase">
                                Hidden
                              </span>
                            )}
                          </div>
                        </button>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ))}
        </div>
      </div>
    </AdminSection>
  );
}
