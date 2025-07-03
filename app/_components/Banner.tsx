"use client";
import ArrowAnimation from "@/app/_components/ArrowAnimation";
import Button from "@/app/_components/Button";
import { GENERAL_INFO } from "@/app/_lib/data";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import Magnet from "./Magnet";
import ShinyText from "./ShinyText";

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
      const wrapperTl = gsap.timeline();
      if (document.querySelector(".animateUp")) {
        wrapperTl
          .to(".wrapper", {
            overflow: "hidden",
            duration: 0.4,
          })
          .from(".animateUp", {
            y: "100%",
            duration: 2,
            delay: 2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: ".animateUp",
              start: "top 80%",
            },
          })
          .to(".wrapper", {
            overflow: "unset",
            delay: 2,
            duration: 0,
          });
      }
    },
    { scope: codeRef }
  );
  return (
    <section className="" id="banner">
      <ArrowAnimation />
      <div
        className="container h-svh min-h-[530px] max-md:pb-10 flex justify-between items-center max-md:flex-col"
        ref={containerRef}
      >
        <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[544px]">
          <h1 className="banner-title slide-up-and-fade leading-[.95] text-6xl sm:text-[80px] font-anton">
            <span className="text-primary">FRONTEND</span>
            <br /> <span className="ml-4">DEVELOPER</span>
          </h1>
          <ShinyText
            className="text-lg slide-up-and-fade"
            text="
            Hi! I'm NEVO. A Frontend Developer with hands-on experience through
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
              className="mt-9 banner-button slide-up-and-fade rounded-md"
            >
              Resume
            </Button>
          </Magnet>
        </div>
        <div className="slide-up-and-fade absolute bottom-20 right-1/2 translate-x-1/2 md:translate-x-0 md:right-20 md:bottom-25">
          <code
            ref={codeRef}
            className="text-white flex flex-col text-xs md:text-sm tracking-widest"
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
