import { Metadata } from "next";

import ExperienceSection from "@/src/features/admin/experience/experience-section";

export const metadata: Metadata = {
  title: "EXPERIENCE"
};

export default function Page() {
  return <ExperienceSection />;
}
