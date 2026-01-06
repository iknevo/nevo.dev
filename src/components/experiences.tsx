"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import SectionTitle from "@/src/components/section-title";
import { useGetExperience } from "@/src/features/admin/experience/api/use-get-experience";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Experiences() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: experience = [], isLoading } = useGetExperience();

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  useGSAP(
    () => {
      if (!experience.length) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 50%",
          toggleActions: "restart none none reverse",
          scrub: 1
        }
      });

      tl.from(".experience-item", {
        y: 50,
        opacity: 0,
        stagger: 0.3
      });
    },
    { scope: containerRef, dependencies: [experience] }
  );

  useGSAP(
    () => {
      if (!experience.length) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 50%",
          end: "bottom 20%",
          scrub: 1
        }
      });

      tl.to(containerRef.current, {
        y: -150,
        opacity: 0
      });
    },
    { scope: containerRef, dependencies: [experience] }
  );

  return (
    <section className="py-section" id="my-experience">
      <div className="container" ref={containerRef}>
        <SectionTitle title="My Experience" />

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="slide-up size-20 animate-spin text-gray-500" />
          </div>
        ) : experience.length === 0 ? (
          <p className="dark slide-up text-muted-foreground py-10 text-3xl">
            There&apos;s no experience added yet
          </p>
        ) : (
          <div className="grid gap-14">
            {experience.map((item) => (
              <div key={item._id} className="experience-item">
                <p className="cursor text-xl text-white/80">{item.company}</p>
                <p className="cursor mt-3.5 mb-2.5 text-3xl leading-none md:text-4xl">
                  {item.title}
                </p>
                <p className="cursor text-lg text-white/80">
                  {item.startDate} - {item.endDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
