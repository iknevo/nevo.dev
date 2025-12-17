import BlogsPage from "@/src/features/blog/blogs-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BLOG"
};

export default function Page() {
  return <BlogsPage />;
}
