"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

import { ProjectResponse } from "@/src/types";

gsap.registerPlugin(useGSAP);

interface Props {
  activeIndex: number;
  projects: ProjectResponse[];
}

/** Pixels each stacked card shows past the card in front of it. */
const PEEK = 16;
/** Cards shown per stack, counting the front card. `VISIBLE` is the hidden slot on each side. */
const VISIBLE = 3;
const SHADE = [0, 0.35, 0.6, 0.6];

const DURATION = 0.8;
const EASE = "expo.out";

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Pose for a card at signed depth `d = index - activeIndex`: upcoming projects (d > 0) stack above
 * the front card, previous ones (d < 0) stack below it. Cards scale around their centre, so
 * `yPercent` makes up for the shrink and exactly `PEEK` px per level shows past the card in front.
 */
const pose = (d: number) => {
  const s = Math.min(Math.abs(d), VISIBLE);
  const sign = Math.sign(d);
  const scale = 1 - s * 0.06;
  return {
    y: sign * s * PEEK,
    yPercent: sign * ((1 - scale) / 2) * 100,
    scale,
    autoAlpha: s < VISIBLE ? 1 : 0,
  };
};

const zFor = (d: number) => 10 - Math.min(Math.abs(d), VISIBLE);
const shadeFor = (d: number) => SHADE[Math.min(Math.abs(d), VISIBLE)];
const isHidden = (d: number) => Math.abs(d) >= VISIBLE;

/**
 * Deck pose for the first paint (before GSAP takes over), with project 0 in front. It only depends
 * on the index, so React never re-applies it and fights the tweens.
 */
const initialCardStyle = (index: number): React.CSSProperties => {
  const { y, yPercent, scale, autoAlpha } = pose(index);
  return {
    transform: `translateY(calc(${yPercent}% + ${y}px)) scale(${scale})`,
    zIndex: zFor(index),
    opacity: autoAlpha,
    visibility: autoAlpha ? "visible" : "hidden",
  };
};

export default function ProjectImagePreview({ activeIndex, projects }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const previousIndexRef = useRef<number | null>(null);
  const initializedForRef = useRef<ProjectResponse[] | null>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".preview-card", rootRef.current);
      if (!cards[activeIndex]) return;

      const shadeOf = (card: HTMLElement) => card.querySelector<HTMLElement>(".preview-shade");

      const placeAll = () => {
        cards.forEach((card, i) => {
          const d = i - activeIndex;
          gsap.killTweensOf(card);
          gsap.set(card, { ...pose(d), zIndex: zFor(d) });
          gsap.set(shadeOf(card), { opacity: shadeFor(d) });
        });
      };

      // First render (or new project data): lay out the deck without animating.
      if (initializedForRef.current !== projects) {
        initializedForRef.current = projects;
        previousIndexRef.current = activeIndex;
        placeAll();
        return;
      }

      const previousIndex = previousIndexRef.current;
      if (previousIndex === null || previousIndex === activeIndex) return;
      previousIndexRef.current = activeIndex;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        placeAll();
        return;
      }

      // Every card moves to its new slot. Its z-index switches right away, so the new front card is
      // on top as it grows out of its stack, and the old front card slides into the other stack
      // just behind it. Each stack settles from the centre outwards.
      cards.forEach((card, i) => {
        const oldD = i - previousIndex;
        const newD = i - activeIndex;

        // A hidden card that ends up on the other side (a big jump) starts from that side's hidden
        // slot, so it fades in from the right stack instead of travelling across the front.
        if (newD !== 0 && isHidden(oldD) && Math.sign(oldD) !== Math.sign(newD)) {
          gsap.set(card, pose(Math.sign(newD) * VISIBLE));
        }

        const delay = Math.min(Math.abs(newD), VISIBLE) * 0.04;
        gsap.set(card, { zIndex: zFor(newD) });
        gsap.to(card, { ...pose(newD), duration: DURATION, ease: EASE, delay, overwrite: true });
        gsap.to(shadeOf(card), {
          opacity: shadeFor(newD),
          duration: DURATION,
          ease: EASE,
          delay,
          overwrite: true,
        });
      });

      gsap.fromTo(
        counterRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, ease: EASE, overwrite: true }
      );
    },
    { scope: rootRef, dependencies: [activeIndex, projects] }
  );

  const activeProject = projects[activeIndex] ?? projects[0];
  if (!activeProject) return null;

  return (
    <article ref={rootRef} aria-live="polite" className="w-full">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.13em] text-white/55 sm:mb-4 sm:text-[11px]">
        <span>SELECTED WORK</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-flex overflow-hidden">
            <span ref={counterRef} className="text-primary inline-block">
              {pad(activeIndex + 1)}
            </span>
          </span>
          / {pad(projects.length)}
        </span>
      </div>

      {/* Fixed-size deck; the margins fit the stacks peeking out above (2 × PEEK plus a gap) and below. */}
      <div className="relative mt-12 mb-8 aspect-[16/10] w-full">
        {projects.map((project, index) => (
          <div
            key={project._id}
            className="preview-card absolute inset-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-[0_0_30px_-10px_rgba(0,0,0,0.8)] will-change-transform"
            style={initialCardStyle(index)}
          >
            <Image
              src={project.thumbnail}
              alt=""
              aria-hidden="true"
              fill
              sizes="160px"
              className="scale-110 object-cover opacity-40 blur-2xl"
            />
            <Image
              src={project.thumbnail}
              alt={index === activeIndex ? `${project.name} preview` : ""}
              fill
              priority={index === 0}
              sizes="(min-width: 1280px) 670px, (min-width: 1024px) 58vw, 100vw"
              className="object-contain"
            />
            <div
              className="preview-shade pointer-events-none absolute inset-0 bg-black"
              style={{ opacity: shadeFor(index) }}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
