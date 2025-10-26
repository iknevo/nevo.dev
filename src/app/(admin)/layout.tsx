import Cursor from "@/src/components/cursor";
import { AdminHeader } from "@/src/features/components/admin-header";
import AdminNav from "@/src/features/components/admin-nav";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="min-h-screen container px-8 py-4 space-y-5">
      <AdminHeader />
      <AdminNav />
      {children}
      <Cursor />
    </main>
  );
}
