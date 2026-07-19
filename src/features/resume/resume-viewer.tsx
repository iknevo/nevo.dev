"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { LoaderSmall } from "@/src/components/loader-small";

export default function ResumeViewer() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    document.title = "RESUME";
  }, []);

  if (loadError) throw loadError;

  const handleLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
    setNumPages(pages);
  };

  const pageWidth = Math.min(typeof window !== "undefined" ? window.innerWidth * 0.9 : 800, 900);

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
      <div className="bg-black/50 md:bg-transparent sticky backdrop-blur-sm md:backdrop-blur-none top-0 z-50 flex items-center justify-end border-b border-white/10 px-4 py-3">
        <a
          href="/api/resume"
          download="ahmed_abdelhafiez_frontend_developer.pdf"
          className="hover:bg-white/15 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-all"
        >
          <Download size={14} />
          Download
        </a>
      </div>
      <div className="flex min-h-screen flex-col items-center bg-black py-10 pt-4">
        <Document
          file="/api/resume"
          onLoadSuccess={handleLoadSuccess}
          onLoadError={(error) => setLoadError(error)}
          loading={<LoaderSmall className="py-30" />}
          noData={
            <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-black">
              <p className="text-base text-gray-400">No resume available.</p>
              <p className="text-sm text-gray-300">Upload one from the admin panel first.</p>
            </div>
          }
          className="flex flex-col items-center gap-8"
        >
          {numPages &&
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
    </>
  );
}
