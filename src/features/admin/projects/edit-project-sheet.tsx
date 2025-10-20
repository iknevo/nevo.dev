import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import {
  projectFormValues,
} from "@/src/definitions/projects.validations";
import { Loader2 } from "lucide-react";
import { useGetProject } from "./api/use-get-project";
import ProjectForm from "./project-form";
import { useOpenProject } from "./state/use-open-project";

export const EditProjectSheet = () => {
  const { isOpen, onClose, id } = useOpenProject();
  const { data: project, isLoading: isLoadingProject } = useGetProject(id);
  const defaultValues = {
    name: project?.name ?? "",
    year: project?.year?.toString() ?? new Date().getFullYear().toString(),
    liveUrl: project?.liveUrl ?? "",
    sourceCode: project?.sourceCode ?? "",
    description: project?.description ?? "",
    features: project?.features?.map((item) => ({ item })) ?? [{ item: "" }],
    techStack: project?.techStack?.map((item) => ({ item })) ?? [{ item: "" }],
    thumbnail: project?.thumbnail ?? "",
    image: project?.image ?? "",
  };

  const onSubmit = (values: projectFormValues) => {
    // createAccount(values, {
    //   onSuccess: onClose,
    // });
    console.log("submit", values);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 dark sm:max-w-xl">
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
            disabled={isLoadingProject}
            defaultValues={defaultValues}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
