import { Suspense } from "react";

import { Signature } from "@/src/components/me/signature";
import { Toaster } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";

import { QueryProvider } from "./query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        <Suspense>{children}</Suspense>
        <Toaster />
        <Signature />
      </TooltipProvider>
    </QueryProvider>
  );
}
