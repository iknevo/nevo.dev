"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4">
      <p className="text-center text-base text-gray-400">
        Something went wrong loading the resume.
      </p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-white/10 px-6 py-2 text-sm text-white transition-all hover:bg-white/15"
      >
        Try again
      </button>
    </div>
  );
}
