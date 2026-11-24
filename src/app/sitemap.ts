import type { MetadataRoute } from "next";

import { env } from "@/src/config/env";
import dbConnect from "@/src/lib/db";
import { Blog } from "@/src/models/blog-model";
import { Project } from "@/src/models/project-model";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  await dbConnect();

  const [projects, posts] = await Promise.all([
    Project.find({ hide: { $ne: true } })
      .select("slug updatedAt")
      .sort({ sortIndex: 1 })
      .lean(),
    Blog.find({ hide: { $ne: true } })
      .select("slug updatedAt")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...projects
      .filter((project) => project.slug)
      .map((project) => ({
        url: `${base}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        priority: 0.7,
      })),
    ...posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${base}/blog/post/${post.slug}`,
        lastModified: post.updatedAt,
        priority: 0.6,
      })),
  ];
}
