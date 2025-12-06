"use client";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BlogSection() {
  return (
    <section>
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <SectionTitle title="My Blog" className="mb-0" />
          <Button
            className="flex items-center justify-center text-lg font-semibold dark"
            variant={"outline"}
            asChild
          >
            <Link href="/admin/blog/add">ADD BLOG</Link>
          </Button>
        </div>
        <div className="grid gap-14"></div>
      </div>
    </section>
  );
}
