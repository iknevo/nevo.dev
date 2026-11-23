import { useState } from "react";

import { stackFormDefaults, stackFormValues } from "@/src/definitions/stack-validations";
import FormSheet from "@/src/features/admin/shared/form-sheet";

import { useCreateStackItem } from "./api/use-create-stack-item";
import StackForm from "./stack-form";
import { useNewStack } from "./state/use-new-stack";

const FORM_ID = "new-stack-form";

export const NewStackSheet = () => {
  const { isOpen, openCount, onClose } = useNewStack();
  const { mutateAsync: createStackItem, isPending } = useCreateStackItem();
  const [isDirty, setIsDirty] = useState(false);

  const onSubmit = async (values: stackFormValues) => {
    await createStackItem(values);
    setIsDirty(false);
    onClose();
  };

  return (
    <FormSheet
      open={isOpen}
      onClose={onClose}
      title="New skill"
      description="Add a skill or tool to your stack."
      formId={FORM_ID}
      submitLabel="Create skill"
      isSaving={isPending}
      isDirty={isDirty}
    >
      <StackForm
        key={openCount}
        formId={FORM_ID}
        defaultValues={stackFormDefaults}
        onSubmit={(values) => onSubmit(values).catch(() => {})}
        onDirtyChange={setIsDirty}
        disabled={isPending}
      />
    </FormSheet>
  );
};
