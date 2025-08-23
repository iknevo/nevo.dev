"use client";

import Button from "@/app/_components/Button";
import { Flag } from "lucide-react";
import { useEffect, useState } from "react";

const animations = ["float", "floatReverse", "float2", "floatReverse2"];

type Particle = {
  char: "0" | "4";
  style: React.CSSProperties;
};

export default function NotFound() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 80 }, (_, i) => {
      const char = i < 40 ? "0" : "4";
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
    setParticles(arr);
  }, []);

  return (
    <div className="relative h-screen mx-auto grid place-items-center text-center px-8 overflow-hidden">
      {particles.map((item, i) => (
        <span
          key={i}
          className="absolute block pointer-events-none opacity-15"
          style={item.style}
        >
          {item.char}
        </span>
      ))}

      <div>
        <Flag className="w-20 h-20 mx-auto" />
        <h1 className="mt-10 text-3xl leading-snug text-white md:text-4xl">
          Error 404 <br /> It looks like something went wrong.
        </h1>
        <Button
          as="link"
          rel="noopener noreferrer"
          href="/"
          variant="primary"
          className="mt-9 banner-button slide-up-and-fade rounded-md"
        >
          Back Home
        </Button>
      </div>
    </div>
  );
}
