"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline();

      timeline
        .to(".page-transition--inner", {
          yPercent: 0,
          duration: 0.2,
        })
        .to(".page-transition--inner", {
          yPercent: -100,
          duration: 0.2,
        })
        .to(".page-transition", {
          yPercent: -100,
        });
    },
    { scope }
  );

  return (
    <div ref={scope}>
      <div className="page-transition fixed inset-0 z-[9999999] overflow-hidden bg-black">
        <div className="page-transition--inner bg-primary-dark absolute inset-0 translate-y-full" />
      </div>
      {children}
    </div>
  );
}
