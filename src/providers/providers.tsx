import { Suspense } from "react";

import { Signature } from "@/src/components/me/signature";
import { Toaster } from "@/src/components/ui/sonner";

import { QueryProvider } from "./query-provider";
import SheetsProvider from "./sheets-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Suspense>{children}</Suspense>
      <SheetsProvider />
      <Toaster />
      <Signature />
    </QueryProvider>
  );
}
