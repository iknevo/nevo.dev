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
        //  TODO: navigate to blogs page
        // router.push("/");
      },
    });
  };
  const onDelete = () => {
    console.log("delete");
  };

  return (
    <section>
      <div className="container">
        <SectionTitle title="Add new blog" className="mb-10" />
        <BlogForm
          onSubmit={onSubmit}
          onDelete={onDelete}
          disabled={isPending}
          defaultValues={blogFormDefaults}
        />
      </div>
    </section>
  );
}
