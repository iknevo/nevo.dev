"use client";

import { format } from "date-fns";
import { ExternalLink, FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { LoaderSmall } from "@/src/components/loader-small";
import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

import { useGetResume } from "./api/use-get-resume";
import { useUploadResume } from "./api/use-upload-resume";

export default function ResumeSection() {
  const { data: resume, isLoading, isError, refetch } = useGetResume();
  const uploadMutation = useUploadResume();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Choose a PDF file to upload");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  return (
    <div className="container pb-10">
      <div className="mb-10 flex items-center justify-between">
        <SectionTitle title="RESUME" className="mb-0" />
      </div>

      {isLoading ? (
        <LoaderSmall className="py-20" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="dark space-y-5 rounded-lg border p-8">
            <h3 className="text-lg font-semibold">Current Resume</h3>
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

          <div className="dark flex h-full flex-col space-y-5 rounded-lg border p-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {resume?.url ? "Replace Current Resume" : "Upload Resume"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {resume?.url
                  ? "Uploading a new PDF will replace the file currently served at /resume."
                  : "Upload a PDF to make your resume available at /resume."}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  aria-label="Choose resume PDF"
                  className="sr-only"
                  tabIndex={-1}
                />
                <div
                  className={cn(
                    "flex min-h-28 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-white/20 p-5 text-center transition-colors",
                    !uploadMutation.isPending && "hover:border-white/40"
                  )}
                >
                  <FileText className="text-muted-foreground size-6" aria-hidden="true" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    Choose PDF
                  </Button>
                  <span className="text-muted-foreground text-xs">PDF files only</span>
                </div>

                <div className="text-muted-foreground mt-2 flex min-h-8 items-center gap-2 text-sm">
                  {selectedFile ? (
                    <>
                      <span className="truncate">{selectedFile.name}</span>
                      <span className="shrink-0 text-xs">
                        ({(selectedFile.size / 1024).toFixed(0)} KB)
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleCancel}
                        disabled={uploadMutation.isPending}
                        aria-label="Remove selected file"
                        className="text-muted-foreground ml-auto hover:text-white"
                      >
                        <X />
                      </Button>
                    </>
                  ) : (
                    <span>No file selected</span>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                variant={!selectedFile ? "outline" : "default"}
                className={cn("mt-auto w-full", selectedFile && "text-white")}
              >
                {uploadMutation.isPending && <Upload className="size-4 animate-pulse" />}
                {uploadMutation.isPending
                  ? "Uploading..."
                  : resume?.url
                    ? "Replace Resume"
                    : "Upload Resume"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
