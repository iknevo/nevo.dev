import { useState } from "react";

import { expFormDefaults, expFormValues } from "@/src/definitions/experience-validations";
import FormSheet from "@/src/features/admin/shared/form-sheet";

import { useCreateExperience } from "./api/use-create-experience";
import ExperienceForm from "./experience-form";
import { useNewExperience } from "./state/use-new-experience";

const FORM_ID = "new-experience-form";

export const NewExperienceSheet = () => {
  const { isOpen, openCount, onClose } = useNewExperience();
  const { mutateAsync: createExperience, isPending } = useCreateExperience();
  const [isDirty, setIsDirty] = useState(false);

  const onSubmit = async (values: expFormValues) => {
    await createExperience(values);
    setIsDirty(false);
    onClose();
  };

  return (
    <FormSheet
      open={isOpen}
      onClose={onClose}
      title="New experience"
      description="Add a role to your timeline."
      formId={FORM_ID}
      submitLabel="Create experience"
      isSaving={isPending}
      isDirty={isDirty}
    >
      <ExperienceForm
        key={openCount}
        formId={FORM_ID}
        defaultValues={expFormDefaults}
        onSubmit={(values) => onSubmit(values).catch(() => {})}
        onDirtyChange={setIsDirty}
        disabled={isPending}
      />
    </FormSheet>
  );
};
