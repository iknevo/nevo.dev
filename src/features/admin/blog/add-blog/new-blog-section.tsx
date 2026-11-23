"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { blogFormDefaults, blogFormValues } from "@/src/definitions/blog-validation";
import { useCreatePost } from "@/src/features/admin/blog/api/use-create-post";
import BlogForm from "@/src/features/admin/blog/blog-form";
import AdminSection from "@/src/features/admin/shared/admin-section";
import { useUnsavedChangesWarning } from "@/src/features/admin/shared/use-unsaved-changes-warning";
import { useConfirm } from "@/src/hooks/use-confirm";

export default function NewBlogSection() {
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const router = useRouter();
  const [confirmDialog, confirm] = useConfirm();
  const [isDirty, setIsDirty] = useState(false);
  useUnsavedChangesWarning(isDirty && !isPending);

  const onSubmit = async (values: blogFormValues) => {
    try {
      await createPost(values);
    } catch {
      return;
    }
    setIsDirty(false);
    router.push("/admin/blog");
  };

  const onCancel = async () => {
    if (isDirty) {
      const ok = await confirm({
        title: "Discard this post?",
        message: "You have unsaved changes. They'll be lost if you leave this page.",
        confirmLabel: "Discard",
      });
      if (!ok) return;
    }
    router.push("/admin/blog");
  };

  return (
    <AdminSection
      title="Add new blog"
      action={
        <Button
          className="dark flex items-center justify-center text-lg font-semibold"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
      }
    >
      {confirmDialog}
      <BlogForm
        onSubmit={onSubmit}
        onDirtyChange={setIsDirty}
        disabled={isPending}
        isSaving={isPending}
        defaultValues={blogFormDefaults}
      />
    </AdminSection>
  );
}
