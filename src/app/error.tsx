"use client";

import { useEffect, useState } from "react";

import Button from "@/src/components/button";
import Cursor from "@/src/components/cursor";

const animations = ["float", "floatReverse", "float2", "floatReverse2"] as const;

type Particle = {
  char: "0" | "5";
  style: React.CSSProperties;
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 80 }, (_, i) => {
      const char: "0" | "5" = i < 40 ? "0" : "5";
      const size = Math.floor(Math.random() * 20) + 10;
      const blur = i * 0.02;
      const speed = Math.floor(Math.random() * 20) + 20;
      const delay = Math.floor(Math.random() * 10) * 0.1;
      const anim = animations[Math.floor(Math.random() * animations.length)];

      return {
        char,
        style: {
          top: `${((Math.random() * 100) / (100 + size / 8)) * 100}%`,
          left: `${((Math.random() * 100) / (100 + size / 10)) * 100}%`,
          fontSize: `${size}px`,
          filter: `blur(${blur}px)`,
          animation: `${speed}s ${anim} infinite`,
          animationDelay: `${delay}s`,
        },
      };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(arr);
  }, [error]);

  if (!particles) {
    return null;
  }

  return (
    <div className="relative mx-auto grid h-screen place-items-center overflow-hidden px-8 text-center">
      <Cursor />

      {particles.map((item, i) => (
        <span key={i} className="pointer-events-none absolute block opacity-15" style={item.style}>
          {item.char}
        </span>
      ))}

      <div>
        <span className="text-7xl text-white md:text-9xl">500</span>
        <h1 className="text-2xl leading-snug text-white md:text-3xl">
          Something broke.
          <br />
          Probably my fault.
        </h1>
        <div className="mt-9 flex items-center justify-center gap-4">
          <Button
            as="link"
            href="/"
            variant="primary"
            className="rounded-md font-semibold text-white transition-colors duration-500 hover:text-black max-sm:px-2 max-sm:py-4 max-sm:text-xs"
          >
            Back Home
          </Button>
          <Button
            as="button"
            onClick={reset}
            variant="secondary"
            className="rounded-md font-semibold max-sm:px-2 max-sm:py-4 max-sm:text-xs"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
