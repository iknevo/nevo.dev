import { useState } from "react";

import { stackFormValues } from "@/src/definitions/stack-validations";
import FormSheet, {
  FormSheetError,
  FormSheetLoading,
} from "@/src/features/admin/shared/form-sheet";
import { useConfirm } from "@/src/hooks/use-confirm";

import { useDeleteStackItem } from "./api/use-delete-stack-item";
import { useGetStackItem } from "./api/use-get-stack-item";
import { useUpdateStackItem } from "./api/use-update-stack-item";
import StackForm from "./stack-form";
import { useOpenStack } from "./state/use-open-stack";

const FORM_ID = "edit-stack-form";

export const EditStackSheet = () => {
  const { isOpen, onClose, id } = useOpenStack();
  const { data: stackItem, isLoading, isError, refetch } = useGetStackItem(id, isOpen);
  const { mutateAsync: updateStackItem, isPending: isSaving } = useUpdateStackItem(id);
  const { mutateAsync: deleteStackItem, isPending: isDeleting } = useDeleteStackItem(id);
  const [confirmDialog, confirm] = useConfirm();
  const [isDirty, setIsDirty] = useState(false);

  const close = () => {
    setIsDirty(false);
    onClose();
  };

  const onSubmit = async (values: stackFormValues) => {
    await updateStackItem(values);
    close();
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: `Delete "${stackItem?.name ?? "this skill"}"?`,
      message: "The skill and its icon will be permanently removed.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await deleteStackItem().then(close, () => {});
  };

  return (
    <>
      {confirmDialog}
      <FormSheet
        open={isOpen}
        onClose={close}
        title="Edit skill"
        description={stackItem?.name ?? "Update the details or remove the skill."}
        formId={FORM_ID}
        submitLabel="Save changes"
        isSaving={isSaving}
        isDeleting={isDeleting}
        isDirty={isDirty}
        submitDisabled={!stackItem}
        onDelete={stackItem ? onDelete : undefined}
        deleteLabel="Delete skill"
      >
        {isLoading ? (
          <FormSheetLoading />
        ) : isError || !stackItem ? (
          <FormSheetError message="We couldn't load this skill." onRetry={() => refetch()} />
        ) : (
          <StackForm
            key={id}
            formId={FORM_ID}
            onSubmit={(values) => onSubmit(values).catch(() => {})}
            onDirtyChange={setIsDirty}
            disabled={isSaving || isDeleting}
            defaultValues={{
              name: stackItem.name ?? "",
              type: stackItem.type ?? "frontend",
              icon: stackItem.icon ?? "",
              hide: stackItem.hide ?? false,
            }}
          />
        )}
      </FormSheet>
    </>
  );
};
