import { Metadata } from "next";

import ResumeSection from "@/src/features/admin/resume/resume-section";

export const metadata: Metadata = {
  title: "RESUME",
};

export default function Page() {
  return <ResumeSection />;
}
