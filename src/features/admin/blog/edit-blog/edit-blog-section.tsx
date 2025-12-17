"use client";

import { useGSAP } from "@gsap/react";
import { useQueryClient } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { blogSchema } from "@/src/definitions/blog-validation";
import { useDeletePost } from "@/src/features/admin/blog/api/use-delete-post";
import { useGetPost } from "@/src/features/admin/blog/api/use-get-post";
import { useUpdatePost } from "@/src/features/admin/blog/api/use-update-post";
import BlogForm from "@/src/features/admin/blog/blog-form";
import { useConfirm } from "@/src/hooks/use-confirm";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  id: string;
}

type FormValues = z.input<typeof blogSchema>;

export default function EditBlogSection({ id }: Props) {
  const router = useRouter();
  const { data: post, isLoading } = useGetPost(id);
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost(id);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost(id);
  const [ConfirmDialog, confirm] = useConfirm();
  const queryClient = useQueryClient();
  const disabled = isLoading || isUpdating || isDeleting;
  const defaultValues = {
    title: post?.title ?? "",
    summary: post?.summary ?? "",
    tags: post?.tags ?? [],
    image: post?.image ?? "",
    doc: post?.doc ?? ""
  };

  const onSubmit = (values: FormValues) => {
    updatePost(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["blog_posts"]
        });
        queryClient.invalidateQueries({
          queryKey: ["blog_post", id]
        });
        router.push("/admin/blog");
      }
    });
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Are You Sure?",
      message: "You are about to delete this blog post."
    });
    if (ok) {
      deletePost(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["blog_posts"]
          });
          queryClient.removeQueries({
            queryKey: ["blog_post", id]
          });
          router.push("/admin/blog");
        }
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <section>
        <div className="container">
          <div className="mb-10 flex items-center justify-between">
            <SectionTitle title="Edit blog" className="mb-0" />
            <Button
              className="dark flex items-center justify-center text-lg font-semibold"
              variant={"outline"}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="text-primary mt-20 size-12 animate-spin" />
            </div>
          ) : (
            <BlogForm
              id={id}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={disabled}
              defaultValues={defaultValues}
            />
          )}
        </div>
      </section>
    </>
  );
}
