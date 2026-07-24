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
      <ul className="mx-auto hidden max-w-xl items-center justify-between md:flex">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "rounded-sm px-2 py-2 text-xs font-semibold transition-all md:px-4 md:text-base",
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
