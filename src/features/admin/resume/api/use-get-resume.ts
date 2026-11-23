import { useQuery } from "@tanstack/react-query";

import { toApiError } from "@/src/lib/api-error";

type ResumeInfo = {
  url: string;
  updatedAt: string | null;
};

export const useGetResume = () => {
  return useQuery<ResumeInfo>({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume?info=true");
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    retry: false,
  });
};
