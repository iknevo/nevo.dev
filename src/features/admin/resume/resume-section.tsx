"use client";

import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { useRef, useState } from "react";

import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";

import { useGetResume } from "./api/use-get-resume";
import { useUploadResume } from "./api/use-upload-resume";

export default function ResumeSection() {
  const { data: resume, isLoading } = useGetResume();
  const uploadMutation = useUploadResume();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        return;
      }
      setSelectedFile(file);
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

  if (isLoading) return null;

  return (
    <div className="container pb-10">
      <div className="mb-10 flex items-center justify-between">
        <SectionTitle title="RESUME" className="mb-0" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="dark space-y-5 rounded-lg border p-8">
          <h3 className="text-lg font-semibold">Current Resume</h3>
          {resume?.url ? (
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A resume PDF is uploaded and accessible at{" "}
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">/resume</code>
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
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 hover:underline"
                >
                  <ExternalLink size={14} />
                  View current resume
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm leading-relaxed">
                No resume uploaded yet. Upload a PDF using the form to make it available at{" "}
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">/resume</code>.
              </p>
              <p className="text-muted-foreground text-xs">
                Visitors will see a 404 until a resume is uploaded.
              </p>
            </div>
          )}
        </div>

        <div className="dark space-y-5 rounded-lg border p-8">
          <h3 className="text-lg font-semibold">Upload New Resume</h3>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="dark text-muted-foreground file:bg-primary block w-full text-sm file:mr-4 file:cursor-pointer file:rounded file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            {selectedFile && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <span className="truncate">{selectedFile.name}</span>
                <span className="shrink-0 text-xs">
                  ({(selectedFile.size / 1024).toFixed(0)} KB)
                </span>
              </p>
            )}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
