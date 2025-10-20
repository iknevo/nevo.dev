import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import {
  ProjectFormDefaults,
  CreateProjectFormValues,
} from "@/src/definitions/projects.validations";
import { Loader2 } from "lucide-react";
import { useGetProject } from "./api/use-get-project";
import ProjectForm from "./project-form";
import { useOpenProject } from "./state/use-open-project";

export const EditProjectSheet = () => {
  const { isOpen, onClose, id } = useOpenProject();
  const { data: project, isLoading: isLoadingProject } = useGetProject(id);
  const defaultValues = project
    ? {
      ...project,
      year: project.year.toString(),
      liveUrl: project.liveUrl ?? "",
      sourceCode: project.sourceCode ?? "",
      description: project.description ?? "",
      features: project.features.map((feat) => ({
        item: feat,
      })),
      techStack: project.techStack.map((tech) => ({
        item: tech,
      })),
      thumbnail: project.thumbnail ?? "",
      images: project.images.map(img => ({ item: img })),
    }
    : ProjectFormDefaults;
  console.log({ project });

  const onSubmit = (values: CreateProjectFormValues) => {
    // createAccount(values, {
    //   onSuccess: onClose,
    // });
    console.log("submit");
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
