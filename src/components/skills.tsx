"use client";
import SectionTitle from "@/src/components/section-title";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { useGetStack } from "../features/admin/stack/api/use-get-stack";
import { Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: stack = [], isLoading } = useGetStack();

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [isLoading, stack]);

  useGSAP(
    () => {
      if (!stack.length) return;

      const slideUpEl = containerRef.current?.querySelectorAll(".slide-up");
      if (!slideUpEl?.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 80%",
          scrub: 0.5,
        },
      });

      tl.from(slideUpEl, {
        opacity: 0,
        y: 40,
        ease: "none",
        stagger: 0.4,
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [stack] },
  );

  useGSAP(
    () => {
      if (!stack.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 50%",
          end: "bottom 10%",
          scrub: 1,
        },
      });

      tl.to(containerRef.current, {
        y: -150,
        opacity: 0,
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [stack] },
  );

  return (
    <section id="my-stack" ref={containerRef}>
      <div className="container">
        <SectionTitle title="My Stack" />

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin slide-up size-20 text-gray-500" />
          </div>
        ) : stack.length === 0 ? (
          <p className="py-10 text-center dark slide-up text-muted-foreground text-3xl">
            There&apos;s no stack added yet
          </p>
        ) : (
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
                      key={item.name}
                    >
                      <div>
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={40}
                          height={40}
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
        )}
      </div>
    </section>
  );
}
