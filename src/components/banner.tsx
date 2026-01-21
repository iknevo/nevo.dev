"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

import Button from "@/src/components/button";
import Magnet from "@/src/components/magnet";
import ShinyText from "@/src/components/shiny-text";

import TransitionLink from "./transition-link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 70%",
          end: "bottom 10%",
          scrub: 1
        }
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
              toggleActions: "play none none reverse"
            }
          });
      }
    },
    { scope: codeRef }
  );
  return (
    <section id="banner" className="relative">
      <div
        className="container flex h-svh justify-center gap-10 max-lg:flex-col max-md:pb-10 lg:items-end lg:justify-between lg:gap-0"
        ref={containerRef}
      >
        <div className="max-w-[544px] flex-col items-start justify-center self-center pt-20 max-lg:flex md:pt-0">
          <h1 className="banner-title slide-up-and-fade text-6xl leading-[.95] sm:text-[80px]">
            <span className="text-primary cursor">FRONTEND</span>
            <br /> <span className="cursor lg:ml-4">DEVELOPER</span>
          </h1>
          <ShinyText
            className="slide-up-and-fade cursor text-lg md:text-xl"
            text="
            Hi! I'm Ahmed also known as NEVO. A Frontend Developer with hands-on experience through
            building high-performance, scalable, and responsive web solutions.
          "
          />
          <Magnet magnetStrength={4}>
            <TransitionLink href={"/blog"}>
              <Button
                as="button"
                variant="primary"
                className="banner-Button slide-up-and-fade cursor mt-9 rounded-md font-semibold text-white transition-colors duration-500 hover:text-black"
              >
                My Blog
              </Button>
            </TransitionLink>
          </Magnet>
        </div>

        <div className={`cursor lg:mb-20`}>
          <code
            ref={codeRef}
            className="slide-up-and-fade hidden flex-col text-xs tracking-widest text-white md:text-sm lg:flex"
          >
            <span className="text-primary block text-lg font-bold">
              {"<span>"}
            </span>
            <div className="inline-block leading-7 md:translate-x-5">
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
            <span className="text-primary block text-lg font-bold">
              {"</span>"}
            </span>
          </code>

          <code className="slide-up-and-fade flex flex-col text-xs tracking-widest text-white lg:hidden lg:text-sm">
            <span className="text-primary block text-lg font-bold">
              {"<span>"}
            </span>
            <div className="inline-block leading-7 lg:translate-x-5">
              <span className="ms-4 inline-block">
                Proficient in the latest web technologies and frameworks,
                continuously expanding my skill set to stay at the forefront of
                the industry.
              </span>
            </div>
            <span className="text-primary block text-lg font-bold">
              {"</span>"}
            </span>
          </code>
        </div>
      </div>
    </section>
  );
}
