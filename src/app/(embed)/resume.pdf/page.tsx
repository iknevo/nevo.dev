"use client";

import dynamic from "next/dynamic";

const ResumeViewer = dynamic(() => import("@/src/features/resume/resume-viewer"), { ssr: false });

export default function ResumePage() {
  return <ResumeViewer />;
}
