"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

gsap.registerPlugin(useGSAP);

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset transition on route change or resize
    const resetTransition = () => {
      gsap.set(".page-transition", { yPercent: 100 });
      gsap.set(".page-transition--inner", { yPercent: 100 });
    };
    resetTransition();
    window.addEventListener("resize", resetTransition);
    return () => window.removeEventListener("resize", resetTransition);
  }, [pathname]);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".page-transition--inner", {
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
  });

  return (
    <div>
      <div className="page-transition w-screen h-screen fixed top-0 left-0 bg-neutral-900 z-[5]">
        <div className="page-transition--inner w-screen h-screen fixed top-0 left-0 bg-primary z-[5] translate-y-full"></div>
      </div>

      {children}
    </div>
  );
}
