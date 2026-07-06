import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to upload resume");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Resume uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
