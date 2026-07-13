import Cursor from "@/src/components/cursor";
import ScrollProgressIndicator from "@/src/components/scroll-progress-indicator";
import { AdminHeader } from "@/src/features/components/admin-header";
import AdminNav from "@/src/features/components/admin-nav";
import SheetsProvider from "@/src/providers/sheets-provider";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="container min-h-screen space-y-5 px-8 py-4">
      <AdminHeader />
      <AdminNav />
      {children}
      <SheetsProvider />
      <Cursor />
      <ScrollProgressIndicator />
    </main>
  );
}
