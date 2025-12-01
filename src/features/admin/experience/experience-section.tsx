"use client";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useNewExperience } from "./state/use-new-experience";
import { useGetExperience } from "./api/use-get-experience";
import { useOpenExperience } from "./state/use-open-experience";
import { Loader2, PenLine } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ExperienceSection() {
  const { data: experience = [], isLoading } = useGetExperience();
  const { onOpen } = useNewExperience();
  const { onOpen: onOpenEdit } = useOpenExperience();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin size-20 text-gray-500" />
      </div>
    );
  return (
    <section>
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <SectionTitle title="My Experience" className="mb-0" />
          <Button
            className="flex items-center justify-center text-lg font-semibold dark"
            variant={"outline"}
            onClick={onOpen}
          >
            <span>ADD ITEM</span>
          </Button>
        </div>

        {experience.length === 0 && (
          <p className="py-10 text-center dark text-muted-foreground text-3xl">
            There&apos;s no experience added yet
          </p>
        )}

        <div className="grid gap-14">
          {experience.map((item) => (
            <div
              key={item._id}
              className="experience-item flex items-center justify-between"
            >
              <div>
                <p className="text-xl cursor text-white/80">{item.company}</p>
                <p className="text-3xl md:text-5xl cursor leading-none mt-3.5 mb-2.5">
                  {item.title}
                </p>
                <p className="text-lg text-white/80 cursor">
                  {item.startDate} - {item.endDate}
                </p>
              </div>

              <button
                onClick={() => onOpenEdit(item._id)}
                className="no-cursor cursor-none"
              >
                <PenLine className="size-8 cursor" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
