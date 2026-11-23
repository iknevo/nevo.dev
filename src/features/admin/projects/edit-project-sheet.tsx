import { useState } from "react";

import { projectFormValues } from "@/src/definitions/projects-validations";
import FormSheet, {
  FormSheetError,
  FormSheetLoading,
} from "@/src/features/admin/shared/form-sheet";
import { useConfirm } from "@/src/hooks/use-confirm";

import { useDeleteProject } from "./api/use-delete-project";
import { useGetProject } from "./api/use-get-project";
import { useUpdateProject } from "./api/use-update-project";
import ProjectForm from "./project-form";
import { uniqueSkillNames } from "./skills-select";
import { useOpenProject } from "./state/use-open-project";

const FORM_ID = "edit-project-form";

export const EditProjectSheet = () => {
  const { isOpen, onClose, id } = useOpenProject();
  const { data: project, isLoading, isError, refetch } = useGetProject(id, true, isOpen);
  const { mutateAsync: updateProject, isPending: isSaving } = useUpdateProject(id);
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject(id);
  const [confirmDialog, confirm] = useConfirm();
  const [isDirty, setIsDirty] = useState(false);

  const close = () => {
    setIsDirty(false);
    onClose();
  };

  const onSubmit = async (values: projectFormValues) => {
    await updateProject(values);
    close();
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: `Delete "${project?.name ?? "this project"}"?`,
      message: "The project and its thumbnail will be permanently removed.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await deleteProject().then(close, () => {});
  };

  return (
    <>
      {confirmDialog}
      <FormSheet
        open={isOpen}
        onClose={close}
        title="Edit project"
        description={project?.name ?? "Update the details or remove the project."}
        formId={FORM_ID}
        submitLabel="Save changes"
        isSaving={isSaving}
        isDeleting={isDeleting}
        isDirty={isDirty}
        submitDisabled={!project}
        onDelete={project ? onDelete : undefined}
        deleteLabel="Delete project"
        size="lg"
      >
        {isLoading ? (
          <FormSheetLoading />
        ) : isError || !project ? (
          <FormSheetError message="We couldn't load this project." onRetry={() => refetch()} />
        ) : (
          <ProjectForm
            key={project._id}
            formId={FORM_ID}
            onSubmit={(values) => onSubmit(values).catch(() => {})}
            onDirtyChange={setIsDirty}
            disabled={isSaving || isDeleting}
            defaultValues={{
              name: project.name ?? "",
              year: project.year?.toString() ?? new Date().getFullYear().toString(),
              liveUrl: project.liveUrl ?? "",
              sourceCode: project.sourceCode ?? "",
              description: project.description ?? "",
              features: project.features?.length
                ? project.features.map((item) => ({ item }))
                : [{ item: "" }],
              techStack: uniqueSkillNames(project.techStack ?? []),
              thumbnail: project.thumbnail ?? "",
              hide: project.hide ?? false,
            }}
          />
        )}
      </FormSheet>
    </>
  );
};
