"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

import AdminSectionButton from "@/src/components/admin-section-button";
import { LoaderSmall } from "@/src/components/loader-small";
import SectionTitle from "@/src/components/section-title";
import { cn } from "@/src/lib/utils";

import { useGetStack } from "./api/use-get-stack";
import { useNewStack } from "./state/use-new-stack";
import { useOpenStack } from "./state/use-open-stack";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StackSection() {
  const { data: stack = [], isLoading } = useGetStack(true);
  const { onOpen } = useNewStack();
  const { onOpen: onOpenEdit } = useOpenStack();

  if (isLoading)
    return (
      <div className="flex justify-center ">
        <LoaderSmall className="py-20" />
      </div>
    );

  return (
    <section id="my-stack">
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="STACK" className="mb-0" />
          <AdminSectionButton onClick={onOpen}>New Skill</AdminSectionButton>
        </div>

        {stack.length === 0 && (
          <p className="dark text-muted-foreground py-10 text-center text-3xl">
            There&apos;s no stack added yet
          </p>
        )}

        <div className="space-y-20">
          {stack.map(({ type, items }) => (
            <div className="flex flex-col gap-10" key={type}>
              <h1 className="text-center text-3xl leading-none text-white/80 uppercase md:text-5xl">{type}</h1>

              <div className="grid grid-cols-3 items-center gap-5 md:grid-cols-3 md:gap-10 lg:grid-cols-5">
                {items.map((item) => (
                  <div
                    className={cn(
                      "project-item group cursor pt-5 leading-none transition-all md:group-hover/projects:opacity-30 md:hover:opacity-100!",
                      item.hide && "opacity-50 grayscale"
                    )}
                    key={item._id}
                    onClick={() => onOpenEdit(item._id)}
                  >
                    <div className="mx-auto flex size-16 items-center justify-center md:size-25">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={100}
                        height={100}
                        quality={100}
                        className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3 text-center text-sm md:mt-5 md:text-lg">
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
