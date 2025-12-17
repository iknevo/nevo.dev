"use client";

import { Flag } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/src/components/button";
import Cursor from "@/src/components/cursor";

const animations = [
  "float",
  "floatReverse",
  "float2",
  "floatReverse2"
] as const;

type Particle = {
  char: "0" | "4";
  style: React.CSSProperties;
};

export default function NotFound() {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 80 }, (_, i) => {
      const char: "0" | "4" = i < 40 ? "0" : "4";
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
          animationDelay: `${delay}s`
        }
      };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(arr);
  }, []);

  if (!particles) {
    return null;
  }

  return (
    <div className="relative mx-auto grid h-screen place-items-center overflow-hidden px-8 text-center">
      <Cursor />

      {particles.map((item, i) => (
        <span
          key={i}
          className="pointer-events-none absolute block opacity-15"
          style={item.style}
        >
          {item.char}
        </span>
      ))}

      <div>
        <Flag className="mx-auto h-20 w-20" />
        <h1 className="mt-10 text-3xl leading-snug text-white md:text-4xl">
          Error 404 <br /> It looks like something went wrong.
        </h1>
        <Button
          as="link"
          rel="noopener noreferrer"
          href="/"
          variant="primary"
          className="banner-button slide-up-and-fade mt-9 rounded-md font-semibold text-white transition-colors duration-500 hover:text-black"
        >
          Back Home
        </Button>
      </div>
    </div>
  );
}
