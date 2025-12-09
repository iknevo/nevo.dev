"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

type LenisScrollEvent = {
  progress: number;
  // you can add scroll, velocity, etc if needed
};

export default function ScrollProgressIndicator() {
  const lenis = useLenis();
  const [hidden, setHidden] = useState(true);
  const [scroll, setScroll] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ progress }: LenisScrollEvent) => {
      const nextScroll = +progress;

      setScroll((prev) => (prev === nextScroll ? prev : nextScroll));

      if (nextScroll > 0.01 && nextScroll < 0.99) {
        setHidden(false);
      } else {
        setHidden(true);
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
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
        "fixed top-1/2 right-[2%] -translate-y-1/2 w-1.5 h-37.5 rounded-full bg-white/10 overflow-hidden transition-opacity duration-500",
        hidden ? "opacity-0" : "opacity-100",
      )}
    >
      <div
        className="w-full bg-gradient-to-b from-[#ff967c] via-[#d84e2c] to-[#b43a1d] rounded-full"
        style={{ height: `${scroll * 100}%` }}
      />
    </div>
  );
}
