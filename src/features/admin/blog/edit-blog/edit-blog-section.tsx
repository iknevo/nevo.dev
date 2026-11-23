"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { blogFormValues } from "@/src/definitions/blog-validation";
import { useDeletePost } from "@/src/features/admin/blog/api/use-delete-post";
import { useGetPost } from "@/src/features/admin/blog/api/use-get-post";
import { useUpdatePost } from "@/src/features/admin/blog/api/use-update-post";
import BlogForm from "@/src/features/admin/blog/blog-form";
import AdminSection, {
  AdminSectionError,
  AdminSectionLoading,
} from "@/src/features/admin/shared/admin-section";
import { useUnsavedChangesWarning } from "@/src/features/admin/shared/use-unsaved-changes-warning";
import { useConfirm } from "@/src/hooks/use-confirm";
import { ApiError } from "@/src/lib/api-error";

interface Props {
  id: string;
}

export default function EditBlogSection({ id }: Props) {
  const router = useRouter();
  const { data: post, isLoading, isError, error, refetch } = useGetPost(id, true);
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost(id);
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost(id);
  const [confirmDialog, confirm] = useConfirm();
  const [isDirty, setIsDirty] = useState(false);
  const busy = isUpdating || isDeleting;
  useUnsavedChangesWarning(isDirty && !busy);

  const leave = () => {
    setIsDirty(false);
    router.push("/admin/blog");
  };

  const onSubmit = async (values: blogFormValues) => {
    try {
      await updatePost(values);
    } catch {
      return;
    }
    leave();
  };

  const onCancel = async () => {
    if (isDirty) {
      const ok = await confirm({
        title: "Discard changes?",
        message: "You have unsaved changes. They'll be lost if you leave this page.",
        confirmLabel: "Discard",
      });
      if (!ok) return;
    }
    leave();
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: `Delete "${post?.title ?? "this post"}"?`,
      message: "The post and its cover image will be permanently removed.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await deletePost().then(leave, () => {});
  };

  const isNotFound = error instanceof ApiError && error.status === 404;

  return (
    <AdminSection
      title="Edit blog"
      action={
        <Button
          className="dark flex items-center justify-center text-lg font-semibold"
          variant="outline"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </Button>
      }
    >
      {confirmDialog}
      {isLoading ? (
        <AdminSectionLoading />
      ) : isError || !post ? (
        <AdminSectionError
          message={isNotFound ? "This post doesn't exist anymore." : "We couldn't load this post."}
          onRetry={isNotFound ? () => router.push("/admin/blog") : () => refetch()}
        />
      ) : (
        <BlogForm
          key={id}
          id={id}
          onSubmit={onSubmit}
          onDelete={onDelete}
          onDirtyChange={setIsDirty}
          disabled={busy}
          isSaving={isUpdating}
          defaultValues={{
            title: post.title ?? "",
            summary: post.summary ?? "",
            tags: post.tags ?? [],
            image: post.image ?? "",
            doc: post.doc ?? "",
            hide: post.hide ?? false,
          }}
        />
      )}
    </AdminSection>
  );
}
