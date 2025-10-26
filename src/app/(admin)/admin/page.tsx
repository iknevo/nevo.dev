import AdminPage from "@/src/features/admin/admin-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADMIN",
};

export default function Page() {
  return <AdminPage />;
}
