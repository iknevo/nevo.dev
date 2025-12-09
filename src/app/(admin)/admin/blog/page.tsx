import BlogSection from "@/src/features/admin/blog/blog-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MANAGE BLOG",
};

export default function Page() {
  return <BlogSection />;
}
