"use client";

import Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/src/lib/utils";

export default function ScrollProgressIndicator() {
  const [hidden, setHidden] = useState(true);
  const [scroll, setScroll] = useState(0);
  const lenis = useLenis();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ progress }: Lenis) => {
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
        "fixed top-1/2 right-[2%] h-37.5 w-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/10 transition-opacity duration-500",
        hidden ? "opacity-0" : "opacity-100"
      )}
    >
      <div
        className="bg-primary w-full rounded-full"
        style={{ height: `${scroll * 100}%` }}
      />
    </div>
  );
}
