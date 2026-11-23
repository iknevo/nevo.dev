"use client";

import { format } from "date-fns";
import { ExternalLink, FileText, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { formatBytes } from "@/src/definitions/upload";
import AdminSection, { AdminSectionLoading } from "@/src/features/admin/shared/admin-section";
import FileDropzone from "@/src/features/admin/shared/file-dropzone";
import { cn } from "@/src/lib/utils";

import { useGetResume } from "./api/use-get-resume";
import { useUploadResume } from "./api/use-upload-resume";

export default function ResumeSection() {
  const { data: resume, isLoading, isError, refetch } = useGetResume();
  const uploadMutation = useUploadResume();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile, {
      onSuccess: () => setSelectedFile(null),
    });
  };

  return (
    <AdminSection title="Resume">
      {isLoading ? (
        <AdminSectionLoading />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="dark space-y-5 rounded-lg border border-white/10 p-6 md:p-8">
            <h3 className="text-lg font-semibold">Current resume</h3>
            {isError ? (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We couldn&apos;t load the current resume status.
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            ) : resume?.url ? (
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The current resume is available at{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">/resume</code>.
                </p>
                {resume.updatedAt && (
                  <div className="text-muted-foreground flex items-center gap-2">
                    Last updated{" "}
                    <span className="text-white">
                      {format(resume.updatedAt, "dd/MM/yyyy 'at' hh:mm a")}
                    </span>
                  </div>
                )}
                <div className="pt-1">
                  <a
                    href="/resume"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary inline-flex items-center gap-1.5 hover:underline"
                  >
                    <ExternalLink size={14} />
                    View current resume
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No resume is uploaded yet. Upload a PDF to make it available at{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">/resume</code>.
                </p>
                <p className="text-muted-foreground text-xs">
                  Visitors will see a 404 until a resume is uploaded.
                </p>
              </div>
            )}
          </div>

          <div className="dark flex h-full flex-col space-y-5 rounded-lg border border-white/10 p-6 md:p-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {resume?.url ? "Replace current resume" : "Upload resume"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {resume?.url
                  ? "Uploading a new PDF will replace the file currently served at /resume."
                  : "Upload a PDF to make your resume available at /resume."}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex-1 space-y-3">
                <FileDropzone
                  accept="application/pdf,.pdf"
                  label="Drop a PDF or"
                  hint="PDF"
                  aria-label="Choose resume PDF"
                  disabled={uploadMutation.isPending}
                  onFile={setSelectedFile}
                  onError={(message) => toast.error(message)}
                />

                {selectedFile && (
                  <div className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-2 text-sm">
                    <FileText className="text-muted-foreground size-4 shrink-0" />
                    <span className="truncate">{selectedFile.name}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatBytes(selectedFile.size)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setSelectedFile(null)}
                      disabled={uploadMutation.isPending}
                      aria-label="Remove selected file"
                      className="text-muted-foreground ml-auto hover:text-white"
                    >
                      <X />
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                variant={!selectedFile ? "outline" : "default"}
                className={cn("mt-auto w-full", selectedFile && "text-white")}
              >
                {uploadMutation.isPending && <Loader2 className="animate-spin" />}
                {uploadMutation.isPending
                  ? "Uploading..."
                  : resume?.url
                    ? "Replace resume"
                    : "Upload resume"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminSection>
  );
}
