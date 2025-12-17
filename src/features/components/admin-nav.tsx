"use client";

import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="py-5">
      <ul className="mx-auto flex max-w-xl items-center justify-between">
        <li>
          <Link
            href="/admin/projects"
            className={cn(
              "rounded-sm px-2 py-2 text-xs font-semibold transition-all md:px-4 md:text-base",
              pathname === "/admin/projects" && "bg-primary"
            )}
          >
            PROJECTS
          </Link>
        </li>
        <li>
          <Link
            href="/admin/skills"
            className={cn(
              "rounded-sm px-2 py-2 text-xs font-semibold transition-all md:px-4 md:text-base",
              pathname === "/admin/skills" && "bg-primary"
            )}
          >
            SKILLS
          </Link>
        </li>
        <li>
          <Link
            href="/admin/experience"
            className={cn(
              "rounded-sm px-2 py-2 text-xs font-semibold transition-all md:px-4 md:text-base",
              pathname === "/admin/experience" && "bg-primary"
            )}
          >
            EXPERIENCE
          </Link>
        </li>
        <li>
          <Link
            href="/admin/blog"
            className={cn(
              "rounded-sm px-2 py-2 text-xs font-semibold transition-all md:px-4 md:text-base",
              pathname.startsWith("/admin/blog") && "bg-primary"
            )}
          >
            BLOG
          </Link>
        </li>
      </ul>
    </div>
  );
}
