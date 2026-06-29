"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface Props {
  modal: { active: boolean; index: number };
  projects: { thumbnail: string }[];
}

export default function ProjectImageModal({ modal, projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = containerRef.current?.offsetParent as HTMLElement | null;
    if (!parent) return;

    const moveContainerX = gsap.quickTo(containerRef.current!, "left", {
      duration: 0.8,
      ease: "power3",
    });
    const moveContainerY = gsap.quickTo(containerRef.current!, "top", {
      duration: 0.8,
      ease: "power3",
    });
    const moveCursorX = gsap.quickTo(cursorRef.current!, "left", {
      duration: 0.5,
      ease: "power3",
    });
    const moveCursorY = gsap.quickTo(cursorRef.current!, "top", {
      duration: 0.5,
      ease: "power3",
    });
    const moveLabelX = gsap.quickTo(labelRef.current!, "left", {
      duration: 0.45,
      ease: "power3",
    });
    const moveLabelY = gsap.quickTo(labelRef.current!, "top", {
      duration: 0.45,
      ease: "power3",
    });

    const onMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      moveContainerX(x);
      moveContainerY(y);
      moveCursorX(x);
      moveCursorY(y);
      moveLabelX(x);
      moveLabelY(y);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const targetScale = modal.active ? 1 : 0;
    const ease = modal.active ? "power3.out" : "power2.inOut";

    [containerRef, cursorRef, labelRef].forEach((ref) => {
      gsap.to(ref.current, {
        scale: targetScale,
        x: "-50%",
        y: "-50%",
        duration: 0.4,
        ease,
        overwrite: "auto",
      });
    });
  }, [modal.active]);

  return (
    <>
      <div
        ref={containerRef}
        className="pointer-events-none absolute z-50 h-[300px] w-[400px] flex items-center justify-center overflow-hidden shadow-xl rounded-2xl cursor-none bg-white/2 backdrop-blur-sm"
      >
        <div
          className="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${modal.index * -100}%` }}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="flex h-full max-w-[340px] w-full relative items-center justify-center mx-auto"
            >
              <Image
                src={project.thumbnail}
                fill
                sizes="340px"
                alt="Project"
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>
      </div>
      <div
        ref={cursorRef}
        className="pointer-events-none absolute z-50 flex h-20 w-20 items-center justify-center rounded-full bg-[#455CE9] text-sm font-light text-white"
      />
      <div
        ref={labelRef}
        className="pointer-events-none absolute z-50 flex h-20 w-20 items-center justify-center rounded-full bg-transparent text-sm font-light text-white"
      >
        View
      </div>
    </>
  );
}
