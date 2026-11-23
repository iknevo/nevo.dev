import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toApiError } from "@/src/lib/api-error";

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/resume", { method: "POST", body: formData });
      if (!res.ok) throw await toApiError(res);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Resume uploaded");
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
