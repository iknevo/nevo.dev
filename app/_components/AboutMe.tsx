"use client";
import { getAge } from "@/app/_lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import ShinyText from "./ShinyText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutMe() {
  const container = useRef<HTMLDivElement>(null);
  const age = getAge("2002-09-21");

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "about-me-in",
          trigger: container.current,
          start: "top 70%",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      tl.from(".slide-up-and-fade", {
        y: 150,
        opacity: 0,
        stagger: 0.05,
      });
    },
    { scope: container }
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "about-me-out",
          trigger: container.current,
          start: "bottom 50%",
          end: "bottom 10%",
          scrub: 0.5,
        },
      });

      tl.to(".slide-up-and-fade", {
        y: -150,
        opacity: 0,
        stagger: 0.02,
      });
    },
    { scope: container }
  );

  return (
    <section className="pb-section" id="about-me">
      <div className="container" ref={container}>
        <h2 className="text-4xl md:text-6xl mb-20 slide-up-and-fade">
          <ShinyText
            className="cursor"
            text="
          I believe in a user centered design approach, ensuring that every
          project I work on is tailored to meet the specific needs of its users.
          "
          />
        </h2>

        <p className="pb-3 border-b text-gray-400 slide-up-and-fade">
          This is me.
        </p>

        <div className="grid md:grid-cols-12 mt-9">
          <div className="md:col-span-5 cursor">
            <p className="text-5xl slide-up-and-fade">
              I&apos;m Nevo
              <span className="text-2xl text-white/75 mt-10 inline-block">
                Web developer with a relentless drive for excellence, skilled in
                creating and maintaining functional and responsive web
                applications and websites.
              </span>
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="text-lg text-white/80 max-w-[450px] cursor">
              <p className="slide-up-and-fade">
                A {age} year old frontend web developer based in Cairo, Egypt.
                Dedicated to turning ideas into creative solutions. I specialize
                in creating seamless and intuitive user experiences.
              </p>
              <p className="mt-3 slide-up-and-fade">
                My approach focuses on creating scalable, high-performing
                solutions tailored to both user needs and business objectives.
                By prioritizing performance, accessibility, and responsiveness,
                I strive to deliver experiences that not only engage users but
                also drive tangible results.
              </p>
            </div>
          </div>
          <div className="slide-up-and-fade col-span-full text-center cursor">
            <p className="text-4xl text-primary uppercase mt-5 md:mt-10">
              i can&apos;t stop configuring my code editor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
