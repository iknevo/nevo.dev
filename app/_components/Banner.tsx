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

const Banner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="overflow-hidden" id="banner">
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
          {/* <p className="banner-description slide-up-and-fade mt-6 text-lg text-muted-foreground">
            Hi! I&apos;m{" "}
            <span className="font-medium text-foreground">Nevo</span>. A
            creative Frontend Developer with hands-on experience through
            building high-performance, scalable, and responsive web solutions.
          </p> */}
          <ShinyText
            className="text-lg"
            text="
            Hi! I'm NEVO. A creative Frontend Developer with hands-on experience through
            building high-performance, scalable, and responsive web solutions.
          "
          />
          <Magnet magnetStrength={4}>
            <Button
              as="link"
              target="_blank"
              rel="noopener noreferrer"
              href={GENERAL_INFO.cv}
              variant="primary"
              className="mt-9 banner-button slide-up-and-fade rounded-md"
            >
              Resume
            </Button>
          </Magnet>
        </div>

        <div className="md:absolute md:bottom-[10%] md:right-[5%] flex md:flex-col gap-4 md:gap-8 text-center md:text-right">
          <div className="slide-up-and-fade">
            <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
              1+
            </h5>
            <p className="text-muted-foreground">Years of Experience</p>
          </div>
          <div className="slide-up-and-fade">
            <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
              3+
            </h5>
            <p className="text-muted-foreground">Completed Projects</p>
          </div>
          <div className="slide-up-and-fade">
            <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
              1k+
            </h5>
            <p className="text-muted-foreground">Hours Worked</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
