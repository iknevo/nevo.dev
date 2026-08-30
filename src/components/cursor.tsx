"use client";

import { useEffect, useState } from "react";
import AnimatedCursor from "react-animated-cursor";

export default function Cursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: coarse)");

    const update = () => setIsTouchDevice(pointer.matches);

    update();
    pointer.addEventListener("change", update);

    return () => pointer.removeEventListener("change", update);
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
      clickables={["a:not(.no-cursor)", "button:not(.no-cursor)", ".cursor"]}
      outerStyle={{ mixBlendMode: "exclusion" }}
      innerStyle={{ mixBlendMode: "exclusion" }}
    />
  );
}
