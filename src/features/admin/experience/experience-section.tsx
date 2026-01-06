"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader2, PenLine } from "lucide-react";

import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";

import { useGetExperience } from "./api/use-get-experience";
import { useNewExperience } from "./state/use-new-experience";
import { useOpenExperience } from "./state/use-open-experience";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ExperienceSection() {
  const { data: experience = [], isLoading } = useGetExperience();
  const { onOpen } = useNewExperience();
  const { onOpen: onOpenEdit } = useOpenExperience();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-20 animate-spin text-gray-500" />
      </div>
    );
  return (
    <section>
      <div className="container">
        <div className="mb-10 flex items-center justify-between">
          <SectionTitle title="My Experience" className="mb-0" />
          <Button
            className="dark flex items-center justify-center text-sm font-semibold md:text-lg"
            variant={"outline"}
            onClick={onOpen}
          >
            New Experience
          </Button>
        </div>

        {experience.length === 0 && (
          <p className="dark text-muted-foreground py-10 text-center text-3xl">
            There&apos;s no experience added yet
          </p>
        )}

        <div className="grid gap-2">
          {experience.map((item) => (
            <div
              className="experience-item flex items-center justify-between"
              key={item._id}
            >
              <div>
                <p className="cursor text-white/80 md:text-xl">
                  {item.company}
                </p>
                <p className="cursor mt-3.5 mb-2.5 text-2xl leading-none md:text-4xl">
                  {item.title}
                </p>
                <p className="cursor text-sm text-white/80 md:text-lg">
                  {item.startDate} - {item.endDate}
                </p>
              </div>

              <button
                onClick={() => onOpenEdit(item._id)}
                className="no-cursor cursor-none"
              >
                <PenLine className="cursor size-7 md:size-8" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
