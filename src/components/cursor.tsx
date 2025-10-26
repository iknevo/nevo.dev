"use client";

import { useEffect, useState } from "react";
import AnimatedCursor from "react-animated-cursor";

export default function Cursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      setIsTouchDevice(hasTouchScreen);
    };

    checkTouchDevice();
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <AnimatedCursor
      innerSize={10}
      outerSize={50}
      color="255,255,255"
      outerAlpha={1}
      innerScale={1}
      outerScale={3.5}
      trailingSpeed={10}
      clickables={["a", "button:not(.no-cursor)", ".cursor"]}
      outerStyle={{ mixBlendMode: "exclusion" }}
      innerStyle={{ mixBlendMode: "exclusion" }}
    />
  );
}
