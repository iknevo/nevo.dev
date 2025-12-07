"use client";

import SectionTitle from "@/src/components/section-title";
import { useGSAP } from "@gsap/react";
import { z } from "zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import BlogForm from "../blog-form";
import { blogSchema } from "@/src/definitions/blog-validation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUpdatePost } from "../api/use-update-post";
import { useGetPost } from "../api/use-get-post";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useConfirm } from "@/src/hooks/use-confirm";
import { useDeletePost } from "../api/use-delete-post";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import TransitionLink from "@/src/components/transition-link";

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
    doc: post?.doc ?? "",
  };

  const onSubmit = (values: FormValues) => {
    updatePost(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["blog_posts"],
        });
        queryClient.invalidateQueries({
          queryKey: ["blog_post", id],
        });
        router.push("/admin/blog");
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Are You Sure?",
      message: "You are about to delete this blog post.",
    });
    if (ok) {
      deletePost(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["blog_posts"],
          });
          queryClient.removeQueries({
            queryKey: ["blog_post", id],
          });
          router.push("/admin/blog");
        },
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <section>
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <SectionTitle title="Edit blog" className="mb-0" />
            <Button
              className="flex items-center justify-center text-lg font-semibold dark"
              variant={"outline"}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="text-primary size-12 animate-spin mt-20" />
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
