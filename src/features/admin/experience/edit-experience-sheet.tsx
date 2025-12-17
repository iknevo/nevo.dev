import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/src/components/ui/sheet";
import { expFormValues } from "@/src/definitions/experience-validations";
import { useConfirm } from "@/src/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useDeleteExperience } from "./api/use-delete-experience";
import { useGetExperienceItem } from "./api/use-get-experience-item";
import { useUpdateExperienceItem } from "./api/use-update-experience-item";
import ExperienceForm from "./experience-form";
import { useOpenExperience } from "./state/use-open-experience";

export const EditExperienceSheet = () => {
  const { isOpen, onClose, id } = useOpenExperience();
  const { data: expItem, isLoading: isLoadingExpItem } =
    useGetExperienceItem(id);
  const { mutate: updateExpItem, isPending: isUpdatingExpItem } =
    useUpdateExperienceItem(id);
  const { mutate: deleteExpItem, isPending: isDeletingExpItem } =
    useDeleteExperience(id);
  const [ConfirmDialog, confirm] = useConfirm();
  const isDisabled = isLoadingExpItem || isUpdatingExpItem || isDeletingExpItem;
  const queryClient = useQueryClient();
  const defaultValues = {
    title: expItem?.title ?? "",
    company: expItem?.company ?? "",
    startDate: expItem?.startDate ?? "",
    endDate: expItem?.endDate ?? ""
  };

  const onSubmit = (values: expFormValues) => {
    updateExpItem(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["experience"]
        });
        queryClient.invalidateQueries({
          queryKey: ["exp_item", id]
        });
        onClose();
      }
    });
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Are You Sure?",
      message: "You are about to delete this experience."
    });
    if (ok) {
      deleteExpItem(undefined, {
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
            <SheetTitle>Edit Experience</SheetTitle>
            <SheetDescription>Edit Or Delete experience</SheetDescription>
          </SheetHeader>

          {isLoadingExpItem ? (
            <div className="flex items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : (
            <ExperienceForm
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
