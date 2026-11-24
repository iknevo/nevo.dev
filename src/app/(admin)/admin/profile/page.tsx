import { Metadata } from "next";

import ProfileSection from "@/src/features/admin/profile/profile-section";

export const metadata: Metadata = {
  title: "PROFILE",
};

export default function Page() {
  return <ProfileSection />;
}
