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
        return { url: "", updatedAt: null };
      }

      return res.json();
    },
    retry: false,
  });
};
