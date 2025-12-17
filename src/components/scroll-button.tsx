"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import { cn } from "@/src/lib/utils";

type Props = {
  scrollToTop?: boolean;
  animate?: boolean;
};

export default function ScrollButton({
  scrollToTop = false,
  animate = true
}: Props) {
  const lenis = useLenis();
  const circleRef = useRef<SVGCircleElement | null>(null);

  const handleClick = () => {
    if (lenis) {
      if (scrollToTop) {
        lenis.scrollTo(0);
      } else {
        lenis.scrollTo("#selected-projects", { offset: -30 });
      }
    }
  };
  useGSAP(() => {
    if (!animate) return;
    if (circleRef.current) {
      const length = circleRef.current.getTotalLength();
      gsap.set(circleRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
      gsap.to(circleRef.current, {
        strokeDashoffset: 0 - length,
        duration: 5,
        ease: "none",
        repeat: -1
      });
    }
  }, []);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group cursor relative size-30 cursor-pointer opacity-20",
        scrollToTop && "rotate-180"
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r="48"
          stroke="white"
          strokeWidth="3"
        />
      </svg>

      <motion.div
        transition={{
          duration: 0.2,
          ease: "circOut"
        }}
        className="flex aspect-square w-full items-center justify-center rounded-full"
      >
        <div>
          <ChevronDown className="size-20 transition duration-300" />
        </div>
      </motion.div>
    </button>
  );
}
