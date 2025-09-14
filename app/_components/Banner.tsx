"use client";
import Button from "@/app/_components/Button";
import { GENERAL_INFO } from "@/app/_lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { useMedia } from "react-use";
import Magnet from "./Magnet";
import ScrollButton from "./scroll-button";
import ShinyText from "./ShinyText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMedia("(min-width: 767px)", false);

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
    (context: gsap.Context) => {
      if (!context) return;

      const animateUps = context.selector?.(".animateUp") ?? [];

      if (animateUps.length > 0) {
        const wrapperTl = gsap.timeline();

        wrapperTl
          .to(".wrapper", { overflow: "hidden", duration: 0.4 })
          .from(animateUps, {
            y: "100%",
            duration: 2,
            delay: 1.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: codeRef.current,
              start: "top+=100 bottom",
              toggleActions: "play none none reverse",
            },
          });
      }
    },
    { scope: codeRef }
  );
  return (
    <section id="banner" className="relative">
      <div
        className="container h-svh max-md:pb-10 flex lg:items-end justify-center gap-10 lg:gap-0 lg:justify-between max-md:flex-col"
        ref={containerRef}
      >
        <div className="max-md:flex flex-col justify-center self-center items-start max-w-[544px]">
          <h1 className="banner-title slide-up-and-fade leading-[.95] text-6xl sm:text-[80px]">
            <span className="text-primary cursor">FRONTEND</span>
            <br /> <span className="lg:ml-4 cursor">DEVELOPER</span>
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

        <div className={`cursor lg:mb-20`}>
          <code
            ref={codeRef}
            className="text-white slide-up-and-fade hidden md:flex flex-col text-xs md:text-sm tracking-widest"
          >
            <span className="block text-lg font-bold text-primary">
              {"<span>"}
            </span>
            <div className="inline-block md:translate-x-5 leading-7">
              <div className="wrapper">
                <span className="animateUp inline-block">
                  Proficient in the latest web technologies and
                </span>
              </div>
              <div className="wrapper">
                <span className="animateUp inline-block">
                  frameworks, continuously expanding my skill set
                </span>
              </div>
              <div className="wrapper">
                <span className="animateUp inline-block">
                  to stay at the forefront of the industry.
                </span>
              </div>
            </div>
            <span className="block text-primary font-bold text-lg">
              {"</span>"}
            </span>
          </code>

          <code className="text-white slide-up-and-fade flex md:hidden flex-col text-xs md:text-sm tracking-widest">
            <span className="block text-lg font-bold text-primary">
              {"<span>"}
            </span>
            <div className="inline-block md:translate-x-5 leading-7">
              <span className="ms-4 inline-block">
                Proficient in the latest web technologies and frameworks,
                continuously expanding my skill set to stay at the forefront of
                the industry.
              </span>
            </div>
            <span className="block text-primary font-bold text-lg">
              {"</span>"}
            </span>
          </code>
        </div>
      </div>
      {isDesktop && (
        <div className="-right-35 bottom-10 hidden md:block  absolute">
          <ScrollButton />
        </div>
      )}
    </section>
  );
}
