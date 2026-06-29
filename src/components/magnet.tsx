"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export default function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}: Props) {
  const [isActive, setIsActive] = useState(false);
  const magnetRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = magnetRef.current;
    const inner = innerRef.current;

    if (disabled || !el || !inner) {
      if (inner) inner.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    const updateRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    updateRect();

    const ro = new ResizeObserver(updateRect);
    ro.observe(el);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = rectRef.current;
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
        setIsActive(true);

        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        inner.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      } else {
        setIsActive(false);
        inner.style.transform = "translate3d(0px, 0px, 0px)";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ro.disconnect();
      inner.style.transform = "translate3d(0px, 0px, 0px)";
    };
  }, [padding, disabled, magnetStrength]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          transform: "translate3d(0px, 0px, 0px)",
          transition: transitionStyle,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
