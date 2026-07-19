"use client";

import Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/src/lib/utils";

export default function ScrollProgressIndicator() {
  const [hidden, setHidden] = useState(true);
  const lenis = useLenis();
  const barRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ progress }: Lenis) => {
      const bar = barRef.current;
      if (bar) {
        bar.style.height = `${progress * 100}%`;
      }

      const shouldHide = progress <= 0.01 || progress >= 0.99;
      if (shouldHide !== hiddenRef.current) {
        hiddenRef.current = shouldHide;
        setHidden(shouldHide);
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        hiddenRef.current = true;
        setHidden(true);
      }, 300);
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [lenis]);

  return (
    <div
      className={cn(
        "fixed top-1/2 right-[2%] h-37.5 w-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/10 transition-opacity duration-500",
        hidden ? "opacity-0" : "opacity-100"
      )}
    >
      <div ref={barRef} className="bg-primary w-full rounded-full" style={{ height: "0%" }} />
    </div>
  );
}
