"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";

const navItems = [
  { label: "PROJECTS", href: "/admin/projects", match: (p: string) => p === "/admin/projects" },
  { label: "STACK", href: "/admin/stack", match: (p: string) => p === "/admin/stack" },
  {
    label: "EXPERIENCE",
    href: "/admin/experience",
    match: (p: string) => p === "/admin/experience",
  },
  { label: "BLOG", href: "/admin/blog", match: (p: string) => p.startsWith("/admin/blog") },
  { label: "RESUME", href: "/admin/resume", match: (p: string) => p === "/admin/resume" },
  { label: "PROFILE", href: "/admin/profile", match: (p: string) => p === "/admin/profile" },
  {
    label: "PASSWORD",
    href: "/admin/update-password",
    match: (p: string) => p === "/admin/update-password",
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const activeItem = navItems.find((item) => item.match(pathname));

  return (
    <div className="py-5">
      <ul className="mx-auto hidden w-fit max-w-full flex-wrap items-center justify-center gap-x-1 gap-y-3 md:flex lg:gap-x-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block rounded-sm px-2 py-2 text-sm font-semibold whitespace-nowrap transition-all lg:px-4 lg:text-base",
                item.match(pathname) && "bg-primary"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="dark md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-sm font-semibold">
              {activeItem?.label ?? "NAVIGATION"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark min-w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuGroup>
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn("text-sm font-semibold", item.match(pathname) && "bg-primary")}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
