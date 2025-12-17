"use client";

import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetStack } from "./api/use-get-stack";
import { useNewStack } from "./state/use-new-stack";
import { useOpenStack } from "./state/use-open-stack";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StackSection() {
  const { data: stack = [], isLoading } = useGetStack();
  const { onOpen } = useNewStack();
  const { onOpen: onOpenEdit } = useOpenStack();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-20 animate-spin text-gray-500" />
      </div>
    );

  return (
    <section id="my-stack">
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="TECH STACK" className="mb-0" />
          <Button
            className="dark flex items-center justify-center text-lg font-semibold"
            variant={"outline"}
            onClick={onOpen}
          >
            <span>ADD ITEM</span>
          </Button>
        </div>

        {stack.length === 0 && (
          <p className="dark text-muted-foreground py-10 text-center text-3xl">
            There&apos;s no stack added yet
          </p>
        )}

        <div className="space-y-20">
          {stack.map(({ type, items }) => (
            <div className="flex flex-col gap-10" key={type}>
              <h1 className="text-center text-5xl leading-none text-white/80 uppercase">
                {type}
              </h1>

              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:grid-cols-5">
                {items.map((item) => (
                  <div
                    className="project-item group cursor pt-5 leading-none transition-all md:group-hover/projects:opacity-30 md:hover:opacity-100!"
                    key={item._id}
                    onClick={() => onOpenEdit(item._id)}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={100}
                      height={100}
                      quality={100}
                      className="mx-auto transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="mt-5 text-center text-lg">
                      <p className="from-primary bg-linear-to-r from-50% to-white to-50% bg-size-[200%] bg-clip-text bg-right text-transparent transition-all duration-700 group-hover:bg-left">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
