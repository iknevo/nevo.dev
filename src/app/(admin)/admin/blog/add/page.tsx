import NewBlogSection from "@/src/features/admin/blog/add-blog/new-blog-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADD NEW BLOG"
};

export default function Page() {
  return <NewBlogSection />;
}
