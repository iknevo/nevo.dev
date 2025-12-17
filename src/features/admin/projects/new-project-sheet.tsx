import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/src/components/ui/sheet";
import {
  projectFormDefaults,
  projectSchema
} from "@/src/definitions/projects-validations";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useCreateProject } from "./api/use-create-project";
import ProjectForm from "./project-form";
import { useNewProject } from "./state/use-new-project";

type FormValues = z.input<typeof projectSchema>;

export const NewProjectSheet = () => {
  const { isOpen, onClose } = useNewProject();
  const { mutate: createAccount, isPending } = useCreateProject();
  const queryClient = useQueryClient();

  const onSubmit = (values: FormValues) => {
    createAccount(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["projects"]
        });
        onClose();
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="dark space-y-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Project</SheetTitle>
          <SheetDescription>Create a new project</SheetDescription>
        </SheetHeader>
        <ProjectForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={projectFormDefaults}
        />
      </SheetContent>
    </Sheet>
  );
};
