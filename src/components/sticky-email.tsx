import { GENERAL_INFO } from "@/src/lib/data";
import React from "react";

export default function StickyEmail() {
  return (
    <div className="max-xl:hidden fixed bottom-10 left-1 block">
      <a
        href={`mailto:${GENERAL_INFO.email}`}
        className="px-3 text-white/80 tracking-wider text-lg transition-colors bg-bottom! hover:text-white hover:bg-center!"
        style={{
          textOrientation: "mixed",
          writingMode: "vertical-rl",
        }}
      >
        {GENERAL_INFO.email}
      </a>
    </div>
  );
}
