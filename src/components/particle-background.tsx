"use client";

import { cn } from "../lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useMemo, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STAR_COUNT = 260;

const LAYERS = ["far", "near"] as const;

type StarLayer = (typeof LAYERS)[number];

type Star = {
  layer: StarLayer;
  x: number;
  y: number;
  size: number;
  opacity: number;
  core: string;
  glow: string;
  flicker: number;
  spike: boolean;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStar(i: number): Star {
  const rnd = mulberry32(i * 2654435761 + 0x5f356495);

  const luminance = Math.pow(rnd(), 2.7);
  const size = 0.7 + luminance * 2.1;
  const opacity = Math.min(1, Math.max(0.1, 0.28 + luminance * 0.72 + (rnd() - 0.5) * 0.2));

  const hue = rnd();
  let core = "#ffffff";
  let glowRgb = "255,255,255";
  if (hue < 0.15) {
    core = "#bfd0ff";
    glowRgb = "173,196,255";
  } else if (hue < 0.23) {
    core = "#ffe7c4";
    glowRgb = "255,208,158";
  } else if (hue < 0.36) {
    core = "#e3e9ff";
    glowRgb = "210,222,255";
  }

  const glow =
    luminance > 0.35
      ? [
          `0 0 ${(size * 1.6).toFixed(1)}px rgba(${glowRgb},0.5)`,
          `0 0 ${(size * 4).toFixed(1)}px rgba(${glowRgb},0.25)`,
          `0 0 ${(size * 9).toFixed(1)}px rgba(${glowRgb},0.1)`,
        ].join(", ")
      : "none";

  const flickerRoll = rnd();
  const flicker = flickerRoll < 0.3 ? 0 : flickerRoll < 0.6 ? 0.35 : 0.7 + rnd() * 0.3;

  const layer = luminance > 0.5 ? (rnd() < 0.75 ? "near" : "far") : rnd() < 0.4 ? "near" : "far";

  return {
    layer,
    x: rnd() * 100,
    y: rnd() * 100,
    size,
    opacity,
    core,
    glow,
    flicker,
    spike: luminance > 0.9,
  };
}

function buildTwinkle(star: HTMLElement, cfg: Star) {
  const base = cfg.opacity;
  const strength = cfg.flicker * (0.15 + base * 0.55);
  const tl = gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(0, 2) });

  let t = 0;
  const bursts = 3 + Math.round(gsap.utils.random(2, 4));
  for (let i = 0; i < bursts; i++) {
    const dip = strength * gsap.utils.random(0.5, 1);
    const fadeIn = gsap.utils.random(0.15, 0.6);
    const fadeOut = gsap.utils.random(0.3, 1.4);
    tl.to(
      star,
      { opacity: Math.max(0.06, base - dip), duration: fadeIn, ease: "sine.inOut" },
      t
    ).to(star, { opacity: base, duration: fadeOut, ease: "sine.inOut" }, t + fadeIn);
    t += fadeIn + fadeOut + gsap.utils.random(0.2, 2.5);
  }

  if (cfg.size >= 1.9) {
    tl.to(
      star,
      {
        opacity: Math.min(1, base + 0.18),
        scale: 1.05,
        duration: 0.22,
        ease: "sine.inOut",
      },
      t + gsap.utils.random(0.4, 2)
    ).to(star, { opacity: base, scale: 1, duration: 0.5, ease: "sine.inOut" });
  }

  return tl;
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  const starsByLayer = useMemo(() => {
    const stars = Array.from({ length: STAR_COUNT }, (_, i) => buildStar(i));
    const grouped: Record<StarLayer, Star[]> = { far: [], near: [] };
    stars.forEach((star) => grouped[star.layer].push(star));
    return {
      far: grouped.far,
      near: grouped.near,
      ordered: [...grouped.far, ...grouped.near],
    };
  }, []);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const elements = container.querySelectorAll<HTMLElement>(".star");

      if (!reduced) {
        starsByLayer.ordered.forEach((cfg, i) => {
          if (cfg.flicker > 0) buildTwinkle(elements[i], cfg);
        });

        const scrollLayers = container.querySelectorAll<HTMLElement>(".star-scroll");
        gsap.to(scrollLayers[0], {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: "max",
            scrub: 0.8,
          },
        });
        gsap.to(scrollLayers[1], {
          y: -90,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: "max",
            scrub: 0.8,
          },
        });

        if (!window.matchMedia("(pointer: coarse)").matches) {
          const mouseLayers = container.querySelectorAll<HTMLElement>("[data-mouse-layer]");
          const toFarX = gsap.quickTo(mouseLayers[0], "x", { duration: 0.9, ease: "power3.out" });
          const toFarY = gsap.quickTo(mouseLayers[0], "y", { duration: 0.9, ease: "power3.out" });
          const toNearX = gsap.quickTo(mouseLayers[1], "x", { duration: 0.9, ease: "power3.out" });
          const toNearY = gsap.quickTo(mouseLayers[1], "y", { duration: 0.9, ease: "power3.out" });

          const onMove = (e: PointerEvent) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            toFarX(nx * 12);
            toFarY(ny * 7);
            toNearX(nx * 26);
            toNearY(ny * 15);
          };

          window.addEventListener("pointermove", onMove);
          return () => window.removeEventListener("pointermove", onMove);
        }
      }
    },
    { scope: containerRef }
  );

  const renderStars = (layer: StarLayer) =>
    starsByLayer[layer].map((star) => (
      <div
        key={`${layer}-${star.x}-${star.y}`}
        className="star absolute rounded-full"
        style={{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: star.size,
          height: star.size,
          background: star.core,
          boxShadow: star.glow,
          opacity: star.opacity,
        }}
      >
        {star.spike && (
          <>
            <span
              aria-hidden
              className="star-spike"
              style={{
                width: star.size * 7,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${star.core}, transparent)`,
              }}
            />
            <span
              aria-hidden
              className="star-spike star-spike--v"
              style={{
                width: star.size * 7,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${star.core}, transparent)`,
              }}
            />
          </>
        )}
      </div>
    ));

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", "mix-blend-screen")}
    >
      {LAYERS.map((layer) => (
        <div key={layer} className="star-scroll absolute -inset-[15%] will-change-transform">
          <div data-mouse-layer className="absolute inset-0 will-change-transform">
            {renderStars(layer)}
          </div>
        </div>
      ))}
    </div>
  );
}
