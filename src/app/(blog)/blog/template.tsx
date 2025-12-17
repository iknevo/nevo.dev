"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function Template({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".page-transition--inner", {
      yPercent: 0,
      duration: 0.2
    })
      .to(".page-transition--inner", {
        yPercent: -100,
        duration: 0.2
      })
      .to(".page-transition", {
        yPercent: -100
      });
  });

  return (
    <div>
      <div className="page-transition fixed top-0 left-0 z-5 h-screen w-screen bg-black">
        <div className="page-transition--inner bg-primary-dark fixed top-0 left-0 z-5 h-screen w-screen translate-y-full" />
      </div>
      {children}
    </div>
  );
}
