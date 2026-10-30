import { useQuery } from "@tanstack/react-query";

type ResumeInfo = {
  url: string;
  updatedAt: string | null;
};

export const useGetResume = () => {
  return useQuery<ResumeInfo>({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume?info=true");

      if (!res.ok) {
        let message = `Failed to load resume (${res.status})`;
        try {
          const data = await res.json();
          if (typeof data?.message === "string") message = data.message;
        } catch {
          // Keep the status-based message when the response is not JSON.
        }
        throw new Error(message);
      }

      return res.json();
    },
    retry: false,
  });
};
