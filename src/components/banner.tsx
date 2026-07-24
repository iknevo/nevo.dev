"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";

import Button from "@/src/components/button";
import Magnet from "@/src/components/magnet";
import ShinyText from "@/src/components/shiny-text";

import TransitionLink from "./transition-link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

      tl.fromTo(".slide-up-and-fade", { y: 0 }, { y: -150, opacity: 0, stagger: 0.02 });
    },
    { scope: containerRef }
  );

  useGSAP(
    (context: gsap.Context) => {
      if (!context) return;

      const animateUps = context.selector?.(".animateUp") ?? [];

      if (animateUps.length > 0) {
        const wrapperTl = gsap.timeline();

        wrapperTl.to(".wrapper", { overflow: "hidden", duration: 0.4 }).from(animateUps, {
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
        className="container flex min-h-svh justify-center gap-10 max-lg:flex-col max-md:pb-10 lg:items-end lg:justify-between lg:gap-0"
        ref={containerRef}
      >
        <div className="max-w-[544px] flex-col items-start justify-center self-center pt-12 max-lg:flex sm:pt-20 md:pt-0">
          <h1
            className="banner-title slide-up-and-fade leading-[1]"
            style={{ fontSize: "clamp(2.8rem, 8vw, 5rem)" }}
          >
            <span className="text-primary cursor">FRONTEND</span>
            <br /> <span className="cursor lg:ml-3">DEVELOPER</span>
          </h1>
          <ShinyText
            className="slide-up-and-fade cursor text-lg md:text-xl"
            text="
            Hi! I'm Ahmed also known as NEVO. A Frontend Developer with hands-on experience through
            building high-performance, scalable, and responsive web solutions.
          "
          />
          <Magnet magnetStrength={4} disabled={isMobile}>
            <TransitionLink href={"/blog"}>
              <Button
                as="button"
                variant="primary"
                className="banner-Button slide-up-and-fade cursor text-primary-foreground mt-9 rounded-md px-6 py-3 text-base font-semibold transition-colors duration-500 hover:text-black sm:px-8 sm:py-4 sm:text-lg"
              >
                My Blog
              </Button>
            </TransitionLink>
          </Magnet>
        </div>

        <div className="cursor lg:mb-20">
          <code
            ref={codeRef}
            className="slide-up-and-fade flex flex-col text-xs tracking-widest text-white md:text-sm lg:text-sm"
          >
            <span className="text-primary block text-lg font-bold">{"<span>"}</span>
            {isMobile ? (
              <div className="inline-block leading-7">
                <span className="ms-4 inline-block">
                  Proficient in the latest web technologies and frameworks, continuously expanding
                  my skill set to stay at the forefront of the industry.
                </span>
              </div>
            ) : (
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
            )}
            <span className="text-primary block text-lg font-bold">{"</span>"}</span>
          </code>
        </div>
      </div>
    </section>
  );
}
