"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";

import { ButtonFill, buttonClasses } from "@/src/components/button";
import Magnet from "@/src/components/magnet";
import ShinyText from "@/src/components/shiny-text";
import type { ProfileValues } from "@/src/definitions/profile-validations";

import TransitionLink from "./transition-link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  profile: ProfileValues | null;
};

export default function Banner({ profile }: Props) {
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

  // Line-by-line reveal of the code block, desktop only (on smaller screens it's one paragraph).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.from(".animateUp", {
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
      });
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
          {profile && <ProfileStatus profile={profile} />}
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
            <TransitionLink
              href="/blog"
              className={buttonClasses(
                "primary",
                "banner-Button slide-up-and-fade cursor text-primary-foreground mt-9 rounded-md px-6 py-3 text-base font-semibold transition-colors duration-500 hover:text-black sm:px-8 sm:py-4 sm:text-lg"
              )}
            >
              <ButtonFill />
              <span className="z-1">My Blog</span>
            </TransitionLink>
          </Magnet>
        </div>

        <div className="cursor lg:mb-20">
          <code
            ref={codeRef}
            className="slide-up-and-fade flex flex-col text-xs tracking-widest text-white md:text-sm lg:text-sm"
          >
            <span className="text-primary block text-lg font-bold">{"<span>"}</span>
            {/* Same markup on every screen size: separate lines for the reveal on desktop, one
                flowing paragraph below lg. */}
            <div className="inline-block leading-7 max-lg:ms-4 lg:translate-x-5">
              <div className="wrapper overflow-hidden max-lg:inline">
                <span className="animateUp inline-block max-lg:inline">
                  Proficient in the latest web technologies and{" "}
                </span>
              </div>
              <div className="wrapper overflow-hidden max-lg:inline">
                <span className="animateUp inline-block max-lg:inline">
                  frameworks, continuously expanding my skill set{" "}
                </span>
              </div>
              <div className="wrapper overflow-hidden max-lg:inline">
                <span className="animateUp inline-block max-lg:inline">
                  to stay at the forefront of the industry.
                </span>
              </div>
            </div>
            <span className="text-primary block text-lg font-bold">{"</span>"}</span>
          </code>
        </div>
      </div>
    </section>
  );
}

function ProfileStatus({ profile }: { profile: ProfileValues }) {
  const place = [profile.location, profile.timezone].filter(Boolean).join(" · ");
  if (!profile.openToWork && !place) return null;

  return (
    <div className="slide-up-and-fade mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {profile.openToWork && (
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          {profile.note || "Open to work"}
        </span>
      )}
      {place && <span className="text-white/60">{place}</span>}
    </div>
  );
}
