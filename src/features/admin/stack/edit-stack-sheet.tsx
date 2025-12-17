import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/src/components/ui/sheet";
import { stackFormValues } from "@/src/definitions/stack-validations";
import { useConfirm } from "@/src/hooks/use-confirm";

import { useDeleteStackItem } from "./api/use-delete-stack-item";
import { useGetStackItem } from "./api/use-get-stack-item";
import { useUpdateStackItem } from "./api/use-update-stack-item";
import StackForm from "./stack-form";
import { useOpenStack } from "./state/use-open-stack";

export const EditStackSheet = () => {
  const { isOpen, onClose, id } = useOpenStack();
  const { data: stackItem, isLoading: isLoadingStackItem } =
    useGetStackItem(id);
  const { mutate: updateStackItem, isPending: isUpdatingStackItem } =
    useUpdateStackItem(id);
  const { mutate: deleteStackItem, isPending: isDeletingStackItem } =
    useDeleteStackItem(id);
  const [ConfirmDialog, confirm] = useConfirm();
  const isDisabled =
    isLoadingStackItem || isUpdatingStackItem || isDeletingStackItem;
  const queryClient = useQueryClient();
  const defaultValues = {
    name: stackItem?.name ?? "",
    type: stackItem?.type ?? "",
    icon: stackItem?.icon ?? ""
  };

  const onSubmit = (values: stackFormValues) => {
    updateStackItem(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["stack"]
        });
        queryClient.invalidateQueries({
          queryKey: ["stack_item", id]
        });
        onClose();
      }
    });
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Are You Sure?",
      message: "You are about to delete this skill."
    });
    if (ok) {
      deleteStackItem(undefined, {
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
            <SheetTitle>Edit Stack Item</SheetTitle>
            <SheetDescription>Edit Or Delete stack item</SheetDescription>
          </SheetHeader>

          {isLoadingStackItem ? (
            <div className="flex items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : (
            <StackForm
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
