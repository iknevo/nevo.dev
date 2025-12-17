"use client";

import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import {
  blogFormDefaults,
  blogSchema
} from "@/src/definitions/blog-validation";
import { useCreatePost } from "@/src/features/admin/blog/api/use-create-post";
import BlogForm from "@/src/features/admin/blog/blog-form";
import { useGSAP } from "@gsap/react";
import { useQueryClient } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRouter } from "next/navigation";
import { z } from "zod";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FormValues = z.input<typeof blogSchema>;

export default function NewBlogSection() {
  const { mutate: createPost, isPending } = useCreatePost();
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit = (values: FormValues) => {
    createPost(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["blog_posts"]
        });
        router.push("/admin/blog");
      }
    });
  };

  return (
    <section>
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="Add new blog" className="mb-0" />
          <Button
            className="dark flex items-center justify-center text-lg font-semibold"
            variant={"outline"}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>

        <BlogForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={blogFormDefaults}
        />
      </div>
    </section>
  );
}
