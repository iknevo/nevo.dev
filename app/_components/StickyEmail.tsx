import { GENERAL_INFO } from "@/app/_lib/data";
import React from "react";

const StickyEmail = () => {
  return (
    <div className="max-xl:hidden fixed bottom-32 left-0 block">
      <a
        href={`mailto:${GENERAL_INFO.email}`}
        className="px-3 text-white/80 tracking-[1px] transition-colors bg-bottom! hover:text-white hover:bg-center!"
        style={{
          textOrientation: "mixed",
          writingMode: "vertical-rl",
        }}
      >
        {GENERAL_INFO.email}
      </a>
    </div>
  );
};

export default StickyEmail;
