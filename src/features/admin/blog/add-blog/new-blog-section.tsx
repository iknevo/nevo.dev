"use client";

import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import Editor from "@/src/features/code-editor/editor";
import Preview from "@/src/features/code-editor/preview";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";
import { useCallback, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function NewBlogSection() {
  const [doc, setDoc] = useState<string>("# Hello, World!\n");
  const handleChangeDoc = useCallback((newDoc: string) => setDoc(newDoc), []);

  return (
    <section>
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <SectionTitle title="Add new blog" className="mb-0" />
          <Button
            className="flex items-center justify-center text-lg font-semibold dark"
            variant={"outline"}
            asChild
          >
            <Link href="/admin/blog/add">ADD new BLOG</Link>
          </Button>
        </div>

        <div className="grid gap-14">
          <div className="flex items-center gap-4 min-h-100">
            <Editor
              initialDoc={doc}
              onChange={handleChangeDoc}
              className="flex-[0_0_50%]"
            />
            <Preview doc={doc} className="flex-[0_0_50%]" />
          </div>
        </div>
      </div>
    </section>
  );
}
