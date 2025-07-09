"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);
export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [numColumns, setNumColumns] = useState(10);
  const [isVisible, setIsVisible] = useState(true);
  const letters = ["N", "E", "V", "O"];

  // Responsive columns (only update if preloader is visible)
  useEffect(() => {
    if (!isVisible) return;
    const updateColumns = () => {
      if (window.innerWidth < 640) setNumColumns(5); // mobile
      else if (window.innerWidth < 1024) setNumColumns(8); // tablet
      else setNumColumns(10); // desktop
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [isVisible]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
      });

      tl.to(".name-text span", {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.5,
        willChange: "transform, opacity",
      });

      tl.to(
        ".preloader-item",
        {
          delay: 0.7,
          y: "100%",
          scaleY: 0.7,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          willChange: "transform, opacity",
        },
        ">"
      );

      tl.to(
        ".name-text span",
        {
          y: 40,
          opacity: 0,
          stagger: 0.09,
          duration: 0.4,
          willChange: "transform, opacity",
        },
        "<0.2"
      );

      tl.to(
        preloaderRef.current,
        {
          autoAlpha: 0,
          duration: 0.5,
          onComplete: () => setIsVisible(false),
        },
        ">"
      );
    },
    { scope: preloaderRef }
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black" ref={preloaderRef}>
      {[...Array(numColumns)].map((_, i) => (
        <div
          className="preloader-item h-full w-[10%] bg-primary-dark"
          key={i}
        ></div>
      ))}
      <p className="name-text flex text-[20vw] lg:text-[200px] text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none overflow-hidden">
        {letters.map((letter, i) => (
          <span className="inline-block translate-y-full opacity-0" key={i}>
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
}
