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

import AdminSectionButton from "@/src/components/admin-section-button";
import { LoaderSmall } from "@/src/components/loader-small";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { useSyncedState } from "@/src/hooks/useSyncedState";
import { ProjectResponse } from "@/src/types";

import { useGetProjects } from "./api/use-get-projects";
import ProjectItem from "./project-item";
import { useNewProject } from "./state/use-new-project";

export default function ProjectsSection() {
  const { isLoading, isError, refetch } = useGetProjects(true);
  const { onOpen } = useNewProject();
  const queryClient = useQueryClient();
  const { mutate: reorder, isPending: isSavingOrder } = useReorder(["projects", true]);
  const [items, setItems] = useSyncedState<ProjectResponse[]>(["projects", true], []);

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
      <div className="container pb-10">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="PROJECTS" className="mb-0" />
          <AdminSectionButton onClick={onOpen}>New Project</AdminSectionButton>
        </div>
        <div className="dark flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">We couldn&apos;t load your projects.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item._id === active.id);
    const newIndex = items.findIndex((item) => item._id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);
    queryClient.setQueryData(["projects", true], newOrder);

    reorder({ ids: newOrder.map((item) => item._id) });
  }

  return (
    <div className="container pb-10">
      <div className="mb-10 flex items-center justify-between">
        <SectionTitle title="PROJECTS" className="mb-0" />
        <AdminSectionButton onClick={onOpen}>New Project</AdminSectionButton>
      </div>

      {isError && (
        <div className="dark mb-6 flex items-center justify-between gap-4 rounded-md border border-dashed px-4 py-3 text-sm">
          <p className="text-muted-foreground">Couldn&apos;t refresh the project list.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {items.length === 0 && (
        <p className="dark text-muted-foreground py-10 text-center text-3xl">
          There&apos;s no projects added yet
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item._id)} strategy={rectSortingStrategy}>
          <div className="relative">
            <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-6.25 lg:grid-cols-4">
              {items.map((project) => (
                <SortableItem
                  key={project._id}
                  id={project._id}
                  variant="grid"
                  disabled={isSavingOrder}
                >
                  <ProjectItem project={project} />
                </SortableItem>
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
