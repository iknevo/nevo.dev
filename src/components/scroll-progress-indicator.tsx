"use client";
import { useEffect, useRef } from "react";

export default function ScrollProgressIndicator() {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollBarRef.current) {
        const { scrollHeight, clientHeight } = document.documentElement;
        const scrollableHeight = scrollHeight - clientHeight;
        const scrollY = window.scrollY;
        const scrollProgress = (scrollY / scrollableHeight) * 100;

        scrollBarRef.current.style.transform = `translateY(-${
          100 - scrollProgress
        }%)`;
      }
    };
    handleScroll();
    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });
    resizeObserver.observe(document.documentElement);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-1/2 right-[2%] -translate-y-1/2 w-1.5 h-[100px] rounded-full bg-white/10 overflow-hidden">
      <div
        className="w-full bg-primary rounded-full h-full"
        ref={scrollBarRef}
      />
    </div>
  );
}
