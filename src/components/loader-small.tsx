import { cn } from "../lib/utils";

import { DotmSquare20 } from "./ui/dotm-square-20";

export function LoaderSmall({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-10", className)}>
      <DotmSquare20 size={66} dotSize={10} speed={1.2} />
    </div>
  );
}
