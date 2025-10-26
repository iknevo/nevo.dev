"use client";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="py-5">
      <ul className="flex items-center justify-between max-w-xl mx-auto">
        <li>
          <Link
            href="/admin/projects"
            className={cn(
              "font-semibold text-xs md:text-base rounded-sm px-4 py-2 transition-all",
              pathname === "/admin/projects" && "bg-primary",
            )}
          >
            PROJECTS
          </Link>
        </li>
        <li>
          <Link
            href="/admin/skills"
            className={cn(
              "font-semibold text-xs md:text-base rounded-sm px-4 py-2 transition-all",
              pathname === "/admin/skills" && "bg-primary",
            )}
          >
            SKILLS
          </Link>
        </li>
        <li>
          <Link
            href="/admin/experience"
            className={cn(
              "font-semibold text-xs md:text-base rounded-sm px-4 py-2 transition-all",
              pathname === "/admin/experience" && "bg-primary",
            )}
          >
            EXPERIENCE
          </Link>
        </li>
      </ul>
    </div>
  );
}
