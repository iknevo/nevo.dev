import type { ReactNode } from "react";

import { LoaderSmall } from "@/src/components/loader-small";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

type Props = {
  title: string;
  action?: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function AdminSection({ title, action, id, className, children }: Props) {
  return (
    <section id={id} className={cn("container pb-10", className)}>
      <div className="mb-10 flex items-center justify-between gap-4">
        <SectionTitle title={title} className="mb-0" />
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminSectionLoading() {
  return (
    <div className="flex justify-center">
      <LoaderSmall className="py-20" />
    </div>
  );
}

export function AdminSectionError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="dark flex flex-col items-center gap-4 rounded-lg border border-dashed border-white/15 p-10 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function AdminRefreshError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="dark mb-6 flex items-center justify-between gap-4 rounded-md border border-dashed border-white/15 px-4 py-3 text-sm">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function AdminEmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="dark text-muted-foreground py-10 text-center text-xl md:text-2xl">{children}</p>
  );
}
