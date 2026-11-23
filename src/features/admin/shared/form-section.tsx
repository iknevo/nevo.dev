import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

type Props = {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export default function FormSection({ title, description, className, children }: Props) {
  return (
    <section
      className={cn(
        "space-y-4 border-t border-white/10 pt-6 first:border-t-0 first:pt-0",
        className
      )}
    >
      <div>
        <h3 className="text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">{title}</h3>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      {children}
    </section>
  );
}
