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
        <Loader2 className="animate-spin size-20 text-gray-500" />
      </div>
    );

  return (
    <section id="my-stack">
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <SectionTitle title="TECH STACK" className="mb-0" />
          <Button
            className="flex items-center justify-center text-lg font-semibold dark"
            variant={"outline"}
            onClick={onOpen}
          >
            <span>ADD ITEM</span>
          </Button>
        </div>

        {stack.length === 0 && (
          <p className="py-10 text-center dark text-muted-foreground text-3xl">
            There&apos;s no stack added yet
          </p>
        )}

        <div className="space-y-20">
          {stack.map(({ type, items }) => (
            <div className="flex flex-col gap-10" key={type}>
              <h1 className="text-5xl text-center leading-none text-white/80 uppercase">
                {type}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 items-center lg:grid-cols-5 gap-10">
                {items.map((item) => (
                  <div
                    className="project-item group cursor leading-none pt-5 md:group-hover/projects:opacity-30 md:hover:opacity-100! transition-all"
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
                    <div className="text-center text-lg mt-5">
                      <p className="transition-all duration-700 bg-linear-to-r from-primary to-white from-50% to-50% bg-size-[200%] bg-right bg-clip-text text-transparent group-hover:bg-left">
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
