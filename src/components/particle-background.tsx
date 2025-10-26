"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export default function ParticleBackground() {
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!particlesRef.current.length) return;

    particlesRef.current.forEach((particle) => {
      gsap.set(particle, {
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        opacity: Math.random(),
        left: Math.random() * window.innerWidth,
        top: Math.random() * window.innerHeight,
      });
      gsap.to(particle, {
        y: window.innerHeight,
        duration: Math.random() * 10 + 10,
        opacity: 0,
        repeat: -1,
        ease: "back.inOut",
      });
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {Array.from({ length: 120 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
          className="absolute rounded-full bg-white"
        />
      ))}
    </div>
  );
}
