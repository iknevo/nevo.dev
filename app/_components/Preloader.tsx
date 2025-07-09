"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);
export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const letters = ["N", "E", "V", "O"];
  const numColumns = 10;

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
        },
        ">"
      );
    },
    { scope: preloaderRef }
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-black" ref={preloaderRef}>
      {[...Array(numColumns)].map(() => (
        <div
          className="preloader-item h-full w-[10%] bg-primary-dark"
          key={Math.random()}
        ></div>
      ))}
      <p className="name-text flex text-[20vw] lg:text-[200px] text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none overflow-hidden">
        {letters.map((letter) => (
          <span
            className="inline-block translate-y-full opacity-0"
            key={Math.random()}
          >
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
}
