import { Metadata } from "next";

import ParticleBackground from "@/src/components/particle-background";
import BlogsPage from "@/src/features/blog/blogs-page";

export const metadata: Metadata = {
  title: "BLOG",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return (
    <>
      <BlogsPage />
      <ParticleBackground subtle />
    </>
  );
}
