import { Metadata } from "next";

import NewBlogSection from "@/src/features/admin/blog/add-blog/new-blog-section";

export const metadata: Metadata = {
  title: "ADD NEW BLOG"
};

export default function Page() {
  return <NewBlogSection />;
}
