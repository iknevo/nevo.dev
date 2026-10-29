"use client";

import dynamic from "next/dynamic";

const ResumeViewer = dynamic(() => import("./resume-viewer"), { ssr: false });

export default function ResumeRoute() {
  return <ResumeViewer />;
}
