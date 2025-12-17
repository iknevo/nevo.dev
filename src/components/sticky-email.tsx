import { GENERAL_INFO } from "@/src/lib/data";

export default function StickyEmail() {
  return (
    <div className="fixed bottom-10 left-1 block max-xl:hidden">
      <a
        href={`mailto:${GENERAL_INFO.email}`}
        className="bg-bottom! px-3 text-lg tracking-wider text-white/80 transition-colors hover:bg-center! hover:text-white"
        style={{
          textOrientation: "mixed",
          writingMode: "vertical-rl"
        }}
      >
        {GENERAL_INFO.email}
      </a>
    </div>
  );
}
