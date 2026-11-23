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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";

import AdminSectionButton from "@/src/components/admin-section-button";
import AdminSection, {
  AdminEmptyState,
  AdminRefreshError,
  AdminSectionError,
  AdminSectionLoading,
} from "@/src/features/admin/shared/admin-section";
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

  const action = <AdminSectionButton onClick={onOpen}>New project</AdminSectionButton>;

  if (isLoading && items.length === 0) {
    return (
      <AdminSection title="Projects" action={action}>
        <AdminSectionLoading />
      </AdminSection>
    );
  }

  if (isError && items.length === 0) {
    return (
      <AdminSection title="Projects" action={action}>
        <AdminSectionError message="We couldn't load your projects." onRetry={() => refetch()} />
      </AdminSection>
    );
  }

  return (
    <AdminSection title="Projects" action={action}>
      {isError && (
        <AdminRefreshError message="Couldn't refresh the project list." onRetry={() => refetch()} />
      )}

      {items.length === 0 && <AdminEmptyState>No projects yet.</AdminEmptyState>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <DragCancel />
        <SortableContext items={items.map((item) => item._id)} strategy={rectSortingStrategy}>
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
        </SortableContext>
      </DndContext>
    </AdminSection>
  );
}
