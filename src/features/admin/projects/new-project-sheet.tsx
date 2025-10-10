import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
// import { insertAccountSchema } from "@/src/db/schema";
import { z } from "zod";
import ProjectForm from "./project-form";
import { useNewProject } from "./state/use-new-project";

// const formSchema = insertAccountSchema.pick({
//   name: true,
// });

const formSchema = z.object({
  name: z.string(),
});

type FormValues = z.input<typeof formSchema>;

export const NewProjectSheet = () => {
  const { isOpen, onClose } = useNewProject();

  // const { mutate: createAccount, isPending } = useCreateProject();

  const onSubmit = (values: FormValues) => {
    // createAccount(values, {
    //   onSuccess: () => {
    //     onClose();
    //   },
    // });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 dark">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <ProjectForm
          onSubmit={onSubmit}
          disabled={false}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
