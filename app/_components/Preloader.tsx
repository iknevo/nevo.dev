"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);
const Preloader = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power1.inOut",
        },
      });

      tl.to(".name-text span", {
        y: 0,
        stagger: 0.05,
        duration: 0.2,
      });

      tl.to(".preloader-item", {
        delay: 1,
        y: "100%",
        duration: 0.5,
        stagger: 0.1,
      })
        .to(".name-text span", { autoAlpha: 0 }, "<0.5")
        .to(
          preloaderRef.current,
          {
            autoAlpha: 0,
          },
          "<1"
        );
    },
    { scope: preloaderRef }
  );

  return (
    <div className="fixed inset-0 z-6 flex" ref={preloaderRef}>
      {[...Array(20)].map((_, i) => (
        <div
          className="preloader-item h-full w-[10%] bg-primary"
          key={Math.random()}
        ></div>
      ))}
      <p className="name-text flex text-[20vw] lg:text-[200px] font-anton text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none overflow-hidden">
        {["N", "E", "V", "O"].map((letter) => (
          <span className="inline-block translate-y-full" key={Math.random()}>
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Preloader;
