"use client";

import ArrowAnimation from "@/app/_components/ArrowAnimation";
import Button from "@/app/_components/Button";
import { GENERAL_INFO } from "@/app/_lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef, useState } from "react";
import Magnet from "./Magnet";
import Preloader from "./Preloader";
import ShinyText from "./ShinyText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Banner() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 70%",
          end: "bottom 10%",
          scrub: 1,
        },
      });

      tl.fromTo(
        ".slide-up-and-fade",
        { y: 0 },
        { y: -150, opacity: 0, stagger: 0.02 }
      );
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      if (!preloaderDone) return;

      const lines = gsap.utils.toArray<HTMLElement>(".wrapper");
      lines.forEach((wrapper) => {
        const target = wrapper.querySelector(".animateUp");
        if (!target) return;

        gsap.set(wrapper, { overflow: "hidden" });

        gsap.fromTo(
          target,
          { y: "100%" },
          {
            y: "0%",
            ease: "circ.out",
            duration: 1,
            scrollTrigger: {
              trigger: wrapper,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: codeRef, dependencies: [preloaderDone] }
  );

  return (
    <section id="banner">
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <div
        className="container relative min-h-dvh max-md:pb-10 flex justify-between items-center max-md:flex-col"
        ref={containerRef}
      >
        <ArrowAnimation />

        <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[544px]">
          <h1 className="banner-title slide-up-and-fade leading-[.95] text-6xl sm:text-[80px] font-anton">
            <span className="text-primary cursor">FRONTEND</span>
            <br />
            <span className="ml-4 cursor">DEVELOPER</span>
          </h1>

          <ShinyText
            className="text-lg slide-up-and-fade cursor"
            text="
              Hi! I'm Ahmed also known as NEVO. A Frontend Developer with hands-on experience through
              building high-performance, scalable, and responsive web solutions.
            "
          />

          <Magnet magnetStrength={4}>
            <Button
              as="link"
              target="_blank"
              rel="noopener noreferrer"
              href={GENERAL_INFO.resume}
              variant="primary"
              className="mt-9 banner-button slide-up-and-fade rounded-md cursor"
            >
              Resume
            </Button>
          </Magnet>
        </div>

        <div
          className={`absolute bottom-15 right-1/2 cursor translate-x-1/2 md:translate-x-0 md:-right-10 md:bottom-25 transition-opacity duration-500 ${
            preloaderDone ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <code
            ref={codeRef}
            className="text-white slide-up-and-fade flex flex-col text-xs md:text-sm tracking-widest"
          >
            <span className="block md:text-lg font-bold text-primary">
              {"<span>"}
            </span>
            <div className="inline-block md:translate-x-5 leading-7">
              <div className="wrapper">
                <span className="animateUp w-max inline-block">
                  Proficient in the latest web technologies and
                </span>
              </div>
              <div className="wrapper">
                <span className="animateUp w-max inline-block">
                  frameworks, continuously expanding my skill set
                </span>
              </div>
              <div className="wrapper">
                <span className="animateUp w-max inline-block">
                  to stay at the forefront of the industry.
                </span>
              </div>
            </div>
            <span className="block text-primary font-bold md:text-lg">
              {"</span>"}
            </span>
          </code>
        </div>
      </div>
    </section>
  );
}
