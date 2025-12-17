"use client";

import { GENERAL_INFO, SOCIAL_LINKS } from "@/src/lib/data";
import { cn } from "@/src/lib/utils";
import { useLenis } from "lenis/react";
import { MoveUpRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const COLORS = [
  "bg-yellow-500 text-black",
  "bg-blue-500 text-white",
  "bg-teal-500 text-black",
  "bg-indigo-500 text-white"
];

const MENU_LINKS = [
  {
    name: "Home",
    url: "#"
  },
  {
    name: "About Me",
    url: "#about-me"
  },
  {
    name: "Experience",
    url: "#my-experience"
  },
  {
    name: "Projects",
    url: "#selected-projects"
  }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (target: string) => {
    const isHome = pathname === "/" || pathname === "";

    if (!isHome) {
      if (target === "#") {
        router.push("/");
      } else {
        router.push("/");
        if (lenis)
          setTimeout(() => {
            lenis.scrollTo(target, { offset: -30 });
          }, 1000);
      }
      return;
    }

    if (!lenis) return;

    if (target === "#") {
      lenis.scrollTo(0);
    } else {
      lenis.scrollTo(target, { offset: -30 });
    }
  };

  return (
    <>
      <div className="sticky top-0 z-4">
        <button
          className={cn(
            "group absolute top-5 right-5 z-2 size-12 cursor-pointer md:right-10"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={cn(
              "absolute top-1/2 left-1/2 inline-block h-0.5 w-3/5 -translate-x-1/2 -translate-y-[5px] rounded-full bg-white duration-300",
              {
                "-translate-y-1/2 rotate-45": isMenuOpen,
                "md:group-hover:rotate-12": !isMenuOpen
              }
            )}
          ></span>
          <span
            className={cn(
              "absolute top-1/2 left-1/2 inline-block h-0.5 w-3/5 -translate-x-1/2 translate-y-[5px] rounded-full bg-white duration-300",
              {
                "-translate-y-1/2 -rotate-45": isMenuOpen,
                "md:group-hover:-rotate-12": !isMenuOpen
              }
            )}
          ></span>
        </button>
      </div>

      <div
        className={cn(
          "overlay fixed inset-0 z-2 bg-black/70 transition-all duration-150",
          {
            "pointer-events-none invisible opacity-0": !isMenuOpen
          }
        )}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div
        className={cn(
          "fixed top-0 right-0 z-3 h-svh w-[500px] max-w-[calc(100vw-3rem)] translate-x-full transform gap-y-14 overflow-hidden transition-transform duration-700",
          "flex flex-col py-10 lg:justify-center",
          { "translate-x-0": isMenuOpen }
        )}
      >
        <div
          className={cn(
            "bg-primary fixed inset-0 z-[-1] translate-x-1/2 scale-150 rounded-[50%] delay-150 duration-700",
            {
              "translate-x-0": isMenuOpen
            }
          )}
        ></div>

        <div className="mx-8 flex w-full max-w-[300px] grow sm:mx-auto md:items-center">
          <div className="flex w-full gap-10 max-lg:flex-col lg:justify-between">
            <div className="max-lg:order-2">
              <p className="mb-5 text-white md:mb-8">SOCIAL</p>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg capitalize hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="">
              <p className="text-muted-white mb-5 md:mb-8">MENU</p>
              <ul className="space-y-3">
                {MENU_LINKS.map((link, idx) => (
                  <li key={link.name}>
                    <button
                      onClick={() => {
                        handleClick(link.url);
                        setIsMenuOpen(false);
                      }}
                      className="group flex items-center gap-3 text-xl"
                    >
                      <span
                        className={cn(
                          "flex size-3.5 items-center justify-center rounded-full bg-white/20 transition-all group-hover:scale-[200%]",
                          COLORS[idx]
                        )}
                      >
                        <MoveUpRight
                          size={8}
                          className="scale-0 transition-all group-hover:scale-100"
                        />
                      </span>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mx-8 w-full max-w-[300px] sm:mx-auto">
          <p className="text-muted-white mb-4">GET IN TOUCH</p>
          <a className="text-lg" href={`mailto:${GENERAL_INFO.email}`}>
            {GENERAL_INFO.email}
          </a>
        </div>
      </div>
    </>
  );
}
