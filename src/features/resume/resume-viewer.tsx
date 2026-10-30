"use client";

import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { LoaderSmall } from "@/src/components/loader-small";
import TransitionLink from "@/src/components/transition-link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";

import ResumeError from "./resume-error";

export default function ResumeViewer() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    document.title = "RESUME";
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const updatePageWidth = () => {
      setPageWidth(Math.min(Math.max(viewer.clientWidth - 32, 240), 900));
    };

    updatePageWidth();
    const observer = new ResizeObserver(updatePageWidth);
    observer.observe(viewer);

    return () => observer.disconnect();
  }, []);

  const handleLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
    setLoadError(null);
    setNumPages(pages);
  };

  const handleLoadError = (error: Error) => {
    setNumPages(null);
    setLoadError(error.message);
  };

  const handleRetry = () => {
    setLoadError(null);
    setNumPages(null);
    setRetryCount((count) => count + 1);
  };

  if (loadError) {
    const isMissing = /\b404\b/.test(loadError);

    return (
      <ResumeError
        title={isMissing ? "No resume is available yet." : undefined}
        description={
          isMissing ? "Upload a resume from the admin panel before opening this page." : undefined
        }
        onRetry={handleRetry}
      />
    );
  }

  return (
    <>
      <style>
        {`
          .react-pdf__Page__textContent span {
            user-select: text !important;
            -webkit-user-select: text !important;
          }
        `}
      </style>
      <header className="flex items-center justify-between border-b border-white/10 bg-black px-3 py-2 sm:px-4 sm:py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <TransitionLink
              href="/"
              aria-label="Back to home"
              className="group inline-flex h-10 items-center gap-2 px-2 text-sm sm:h-12 sm:text-base"
            >
              <ArrowLeft className="group-hover:text-primary transition-all duration-300 group-hover:-translate-x-1" />
              <span>Back</span>
            </TransitionLink>
          </TooltipTrigger>
          <TooltipContent>Back to home</TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-3">
          {numPages && (
            <span className="text-muted-foreground hidden text-xs sm:inline" aria-live="polite">
              {numPages} {numPages === 1 ? "page" : "pages"}
            </span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/api/resume"
                download="ahmed_abdelhafiez_frontend_developer.pdf"
                aria-label="Download resume as PDF"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white transition-all hover:bg-white/15 sm:px-4"
              >
                <Download size={16} aria-hidden="true" />
                <span>Download</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>Download resume as PDF</TooltipContent>
          </Tooltip>
        </div>
      </header>
      <div className="flex min-h-screen flex-col items-center bg-black py-8 pt-4 sm:py-10 sm:pt-6">
        <div ref={viewerRef} className="w-full max-w-[932px] px-3 sm:px-4">
          <Document
            key={retryCount}
            file="/api/resume"
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={<LoaderSmall className="py-30" />}
            noData={<LoaderSmall className="py-30" />}
            className="flex flex-col items-center gap-6 sm:gap-8"
          >
            {numPages &&
              pageWidth &&
              Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={i + 1}
                  pageNumber={i + 1}
                  renderTextLayer
                  width={pageWidth}
                  className="rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                />
              ))}
          </Document>
        </div>
      </div>
    </>
  );
}
