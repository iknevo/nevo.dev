import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
// import { insertAccountSchema } from "@/src/db/schema";
// import useConfirm from "@/src/hooks/use-confirm";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import ProjectForm from "./project-form";
import { useOpenProject } from "./state/use-open-project";
// import { useDeleteAccount } from "../api/use-delete-account";
// import { useEditAccount } from "../api/use-edit-account";
// import { useGetAccount } from "../api/use-get-account";
// import { useOpenAccount } from "../state/use-open-account";
// import AccountForm from "./account-form";

// const formSchema = insertAccountSchema.pick({
//   name: true,
// });

// type FormValues = z.input<typeof formSchema>;

const formSchema = z.object({
  name: z.string(),
});

type FormValues = z.input<typeof formSchema>;

export const EditProjectSheet = () => {
  const { isOpen, onClose, id } = useOpenProject();
  // const [ConfirmDialog, confirm] = useConfirm();
  // const { data: account, isLoading } = useGetAccount(id);
  // const { mutate: updateAccount, isPending: isUpdating } = useEditAccount(id);
  // const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount(id);
  // const defaultValues = account ? { name: account.name } : { name: "" };
  const defaultValues = { name: "" };
  // const isPending = isUpdating || isDeleting;

  const onSubmit = (values: FormValues) => {
    // updateAccount(values, {
    //   onSuccess: () => {
    //     onClose();
    //   },
    // });
  };

  const onDelete = async () => {
    // const ok = await confirm({
    //   title: "Are You Sure?",
    //   message: "You are about deleting this account.",
    // });
    // if (ok) {
    //   deleteAccount(undefined, {
    //     onSuccess: () => {
    //       onClose();
    //     },
    //   });
    // }
  };

  return (
    <>
      {/* <ConfirmDialog /> */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account</SheetDescription>
          </SheetHeader>
          {true ? (
            <div className="flex items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : (
            <ProjectForm
              id={id}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={false}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
