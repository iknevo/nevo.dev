import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/src/components/ui/sheet";
import { projectFormValues } from "@/src/definitions/projects-validations";
import { useConfirm } from "@/src/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useDeleteProject } from "./api/use-delete-project";
import { useGetProject } from "./api/use-get-project";
import { useUpdateProject } from "./api/use-update-project";
import ProjectForm from "./project-form";
import { useOpenProject } from "./state/use-open-project";

export const EditProjectSheet = () => {
  const { isOpen, onClose, id } = useOpenProject();
  const { data: project, isLoading: isLoadingProject } = useGetProject(id);
  const { mutate: updateProject, isPending: isUpdatingProject } =
    useUpdateProject(id);
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject(id);
  const [ConfirmDialog, confirm] = useConfirm();
  const isDisabled = isLoadingProject || isUpdatingProject || isDeletingProject;
  const queryClient = useQueryClient();
  const defaultValues = {
    name: project?.name ?? "",
    year: project?.year?.toString() ?? new Date().getFullYear().toString(),
    liveUrl: project?.liveUrl ?? "",
    sourceCode: project?.sourceCode ?? "",
    description: project?.description ?? "",
    features: project?.features?.map((item) => ({ item })) ?? [{ item: "" }],
    techStack: project?.techStack?.map((item) => ({ item })) ?? [{ item: "" }],
    thumbnail: project?.thumbnail ?? "",
    image: project?.image ?? ""
  };

  const onSubmit = (values: projectFormValues) => {
    updateProject(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["projects"]
        });
        queryClient.invalidateQueries({
          queryKey: ["project", id]
        });
        onClose();
      }
    });
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Are You Sure?",
      message: "You are about to delete this project."
    });
    if (ok) {
      deleteProject(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="dark space-y-4 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Project</SheetTitle>
            <SheetDescription>Edit project</SheetDescription>
          </SheetHeader>

          {isLoadingProject ? (
            <div className="flex items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : (
            <ProjectForm
              id={id}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isDisabled}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
