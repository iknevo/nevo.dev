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
  console.log(stack);

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
            <div className="grid md:grid-cols-12" key={type}>
              <div className="md:col-span-5">
                <p className="slide-up text-5xl leading-none text-white/80 uppercase">
                  {type}
                </p>
              </div>

              <div className="md:col-span-7 flex gap-x-11 gap-y-9 flex-wrap">
                {items.map((item) => (
                  <div
                    className="slide-up flex gap-3.5 items-center leading-none"
                    key={item._id}
                    onClick={() => onOpenEdit(item._id)}
                  >
                    <div>
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width="40"
                        height="40"
                        className="max-h-10"
                      />
                    </div>
                    <span className="text-2xl capitalize">{item.name}</span>
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
