import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
// import { insertAccountSchema } from "@/src/db/schema";
import {
  CreateProjectSchema,
  ProjectFormDefaults,
} from "@/src/definitions/projects.validations";
import { z } from "zod";
import useCreateProject from "./api/use-create-project";
import ProjectForm from "./project-form";
import { useNewProject } from "./state/use-new-project";

type FormValues = z.input<typeof CreateProjectSchema>;

export const NewProjectSheet = () => {
  const { isOpen, onClose } = useNewProject();
  const { mutate: createAccount, isPending } = useCreateProject();

  const onSubmit = (values: FormValues) => {
    createAccount(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 dark sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>New Project</SheetTitle>
          <SheetDescription>Create a new project</SheetDescription>
        </SheetHeader>
        <ProjectForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={ProjectFormDefaults}
        />
      </SheetContent>
    </Sheet>
  );
};
