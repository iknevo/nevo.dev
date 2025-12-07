"use client";

import SectionTitle from "@/src/components/section-title";
import { useGSAP } from "@gsap/react";
import { z } from "zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import BlogForm from "../blog-form";
import {
  blogFormDefaults,
  blogSchema,
} from "@/src/definitions/blog-validation";
import { useQueryClient } from "@tanstack/react-query";
import { useCreatePost } from "../api/use-create-post";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

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
          queryKey: ["blog_posts"],
        });
        router.push("/admin/blog");
      },
    });
  };

  return (
    <section>
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <SectionTitle title="Add new blog" className="mb-0" />
          <Button
            className="flex items-center justify-center text-lg font-semibold dark"
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
