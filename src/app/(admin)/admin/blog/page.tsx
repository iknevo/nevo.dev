import { Metadata } from "next";

import BlogSection from "@/src/features/admin/blog/blog-section";

export const metadata: Metadata = {
  title: "MANAGE BLOG"
};

export default function Page() {
  return <BlogSection />;
}
