import { useState } from "react";

import { expFormValues } from "@/src/definitions/experience-validations";
import FormSheet, {
  FormSheetError,
  FormSheetLoading,
} from "@/src/features/admin/shared/form-sheet";
import { useConfirm } from "@/src/hooks/use-confirm";

import { useDeleteExperience } from "./api/use-delete-experience";
import { useGetExperienceItem } from "./api/use-get-experience-item";
import { useUpdateExperienceItem } from "./api/use-update-experience-item";
import ExperienceForm from "./experience-form";
import { useOpenExperience } from "./state/use-open-experience";

const FORM_ID = "edit-experience-form";

export const EditExperienceSheet = () => {
  const { isOpen, onClose, id } = useOpenExperience();
  const { data: expItem, isLoading, isError, refetch } = useGetExperienceItem(id, isOpen);
  const { mutateAsync: updateExpItem, isPending: isSaving } = useUpdateExperienceItem(id);
  const { mutateAsync: deleteExpItem, isPending: isDeleting } = useDeleteExperience(id);
  const [confirmDialog, confirm] = useConfirm();
  const [isDirty, setIsDirty] = useState(false);

  const close = () => {
    setIsDirty(false);
    onClose();
  };

  const onSubmit = async (values: expFormValues) => {
    await updateExpItem(values);
    close();
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete this experience?",
      message: `${expItem?.title ?? "This role"}${expItem?.company ? ` at ${expItem.company}` : ""} will be permanently removed.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await deleteExpItem().then(close, () => {});
  };

  return (
    <>
      {confirmDialog}
      <FormSheet
        open={isOpen}
        onClose={close}
        title="Edit experience"
        description={
          expItem ? `${expItem.title} · ${expItem.company}` : "Update the role or remove it."
        }
        formId={FORM_ID}
        submitLabel="Save changes"
        isSaving={isSaving}
        isDeleting={isDeleting}
        isDirty={isDirty}
        submitDisabled={!expItem}
        onDelete={expItem ? onDelete : undefined}
        deleteLabel="Delete experience"
      >
        {isLoading ? (
          <FormSheetLoading />
        ) : isError || !expItem ? (
          <FormSheetError message="We couldn't load this experience." onRetry={() => refetch()} />
        ) : (
          <ExperienceForm
            key={id}
            formId={FORM_ID}
            onSubmit={(values) => onSubmit(values).catch(() => {})}
            onDirtyChange={setIsDirty}
            disabled={isSaving || isDeleting}
            defaultValues={{
              title: expItem.title ?? "",
              company: expItem.company ?? "",
              startDate: expItem.startDate ?? "",
              endDate: expItem.endDate ?? "",
              hide: expItem.hide ?? false,
            }}
          />
        )}
      </FormSheet>
    </>
  );
};
