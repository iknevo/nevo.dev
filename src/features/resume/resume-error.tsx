"use client";

type Props = {
  description?: string;
  onRetry: () => void;
  title?: string;
};

export default function ResumeError({
  title = "We couldn’t load the resume.",
  description = "Please try again in a moment.",
  onRetry,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4">
      <div className="space-y-2 text-center">
        <p className="text-base text-gray-300">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full bg-white/10 px-6 py-2 text-sm text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
      >
        Try again
      </button>
    </div>
  );
}
