import { useState } from "react";

import { projectFormDefaults, projectFormValues } from "@/src/definitions/projects-validations";
import FormSheet from "@/src/features/admin/shared/form-sheet";

import { useCreateProject } from "./api/use-create-project";
import ProjectForm from "./project-form";
import { useNewProject } from "./state/use-new-project";

const FORM_ID = "new-project-form";

export const NewProjectSheet = () => {
  const { isOpen, openCount, onClose } = useNewProject();
  const { mutateAsync: createProject, isPending } = useCreateProject();
  const [isDirty, setIsDirty] = useState(false);

  const onSubmit = async (values: projectFormValues) => {
    await createProject(values);
    setIsDirty(false);
    onClose();
  };

  return (
    <FormSheet
      open={isOpen}
      onClose={onClose}
      title="New project"
      description="Add a project to your portfolio."
      formId={FORM_ID}
      submitLabel="Create project"
      isSaving={isPending}
      isDirty={isDirty}
      size="lg"
    >
      <ProjectForm
        key={openCount}
        formId={FORM_ID}
        defaultValues={projectFormDefaults}
        onSubmit={(values) => onSubmit(values).catch(() => {})}
        onDirtyChange={setIsDirty}
        disabled={isPending}
      />
    </FormSheet>
  );
};
