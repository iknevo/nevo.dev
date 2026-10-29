"use client";

import ResumeError from "@/src/features/resume/resume-error";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ResumeError onRetry={reset} />;
}
