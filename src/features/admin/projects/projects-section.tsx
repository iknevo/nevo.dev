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
import { useSyncedState } from "@/src/hooks/useSyncedState";
import { ProjectResponse } from "@/src/types";

import { useGetProjects } from "./api/use-get-projects";
import ProjectItem from "./project-item";
import { useNewProject } from "./state/use-new-project";

export default function ProjectsSection() {
  const { isLoading } = useGetProjects(true);
  const { onOpen } = useNewProject();
  const queryClient = useQueryClient();
  const { mutate: reorder } = useReorder(["projects"]);
  const [items, setItems] = useSyncedState<ProjectResponse[]>(["projects"], []);

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
    queryClient.setQueryData(["projects"], newOrder);

    reorder({ ids: newOrder.map((item) => item._id) });
  }

  return (
    <div className="container pb-10">
      <div className="mb-10 flex items-center justify-between">
        <SectionTitle title="PROJECTS" className="mb-0" />
        <AdminSectionButton onClick={onOpen}>New Project</AdminSectionButton>
      </div>

      {items.length === 0 && (
        <p className="dark text-muted-foreground py-10 text-center text-3xl">
          There&apos;s no projects added yet
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item._id)} strategy={rectSortingStrategy}>
          <div className="group/projects relative">
            <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-6.25 lg:grid-cols-4">
              {items.map((project) => (
                <SortableItem key={project._id} id={project._id} variant="grid">
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
