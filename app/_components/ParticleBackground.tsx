"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export default function ParticleBackground() {
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    particlesRef.current.forEach((particle) => {
      const width = Math.random() * 3 + 1;
      const height = Math.random() * 3 + 1;
      const opacity = Math.random();
      const left = Math.random() * window.innerWidth;
      const top = Math.random() * (window.innerHeight + 1);
      gsap.set(particle, {
        width,
        height,
        opacity,
        left,
        top,
        willChange: "transform, opacity",
        transform: `translate3d(0, 0, 0)`,
      });
      gsap.to(particle, {
        y: window.innerHeight,
        duration: Math.random() * 10 + 10,
        opacity: 0,
        repeat: -1,
        ease: "back.inOut",
        force3D: true,
      });
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(120)].map((_, i) => (
        <div
          key={Math.random()}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
          className="absolute rounded-full bg-white"
        />
      ))}
    </div>
  );
}
