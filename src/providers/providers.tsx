import { Toaster } from "@/src/components/ui/sonner";
import { QueryProvider } from "./query-provider";
import SheetsProvider from "./sheets-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <SheetsProvider />
      <Toaster />
    </QueryProvider>
  );
}
