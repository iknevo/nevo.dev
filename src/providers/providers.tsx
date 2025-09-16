import { Toaster } from "@/src/components/ui/sonner";
// import AuthProvider from "./auth-provider";
import { QueryProvider } from "./query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {/* <AuthProvider> */}
      {children}
      {/* </AuthProvider> */}
      <Toaster />
    </QueryProvider>
  );
}
