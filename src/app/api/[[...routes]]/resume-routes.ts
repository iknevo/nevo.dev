import { Hono } from "hono";
import status from "http-status";

import { uploadPdfToCloudinary } from "@/src/lib/cloudinary";
import dbConnect from "@/src/lib/db";
import { authMiddleware } from "@/src/lib/jwt";
import { Resume } from "@/src/models/resume-model";

const app = new Hono()
  .get("/", async (c) => {
    await dbConnect();
    const resume = await Resume.findOne();
    const asInfo = c.req.query("info") === "true";

    if (asInfo) {
      if (!resume) {
        return c.json({ url: "", updatedAt: null });
      }
      return c.json({ url: resume.url, updatedAt: resume.updatedAt });
    }

    if (!resume) {
      return c.json({ message: "No resume uploaded yet" }, status.NOT_FOUND);
    }

    const pdfResponse = await fetch(resume.url);
    if (!pdfResponse.ok) {
      return c.json({ message: "Failed to fetch resume" }, status.INTERNAL_SERVER_ERROR);
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    return c.newResponse(pdfBuffer, 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="ahmed_abdelhafiez_frontend_developer.pdf"',
    });
  })
  .post("/", authMiddleware, async (c) => {
    await dbConnect();
    const body = await c.req.formData();
    const file = body.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ message: "No PDF file provided" }, status.BAD_REQUEST);
    }

    if (file.type !== "application/pdf") {
      return c.json({ message: "Only PDF files are allowed" }, status.BAD_REQUEST);
    }

    const url = await uploadPdfToCloudinary(file, "resume");

    const resume = await Resume.findOneAndUpdate({}, { url }, { upsert: true, new: true });

    return c.json({ success: true, url: resume.url, updatedAt: resume.updatedAt });
  });

export default app;
