import { v2 as cloudinary } from "cloudinary";

import { env } from "@/src/config/env";
import { AppError } from "@/src/lib/error-handlers";

const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_PDF_UPLOAD_BYTES = 10 * 1024 * 1024;

function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new AppError("Only image files are allowed", 400);
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new AppError("Image must be 10 MB or smaller", 400);
  }
}

function validatePdfFile(file: File) {
  if (file.type !== "application/pdf") {
    throw new AppError("Only PDF files are allowed", 400);
  }
  if (file.size > MAX_PDF_UPLOAD_BYTES) {
    throw new AppError("PDF must be 10 MB or smaller", 400);
  }
}

cloudinary.config({
  cloud_name: env.cloudinary.cloud_name,
  api_key: env.cloudinary.api_key,
  api_secret: env.cloudinary.api_secret,
});

export type UploadedAsset = {
  url: string;
  publicId: string;
};

export const uploadToCloudinary = async (file: File, folder: string): Promise<UploadedAsset> => {
  validateImageFile(file);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadedAsset>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, format: "webp" },
      (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error("Cloudinary upload returned no result"));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
};

export const uploadPdfToCloudinary = async (file: File, folder: string): Promise<UploadedAsset> => {
  validatePdfFile(file);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadedAsset>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "raw" },
      (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error("Cloudinary upload returned no result"));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
};

export const destroyCloudinaryAsset = async (
  publicId: string,
  resourceType: "image" | "raw" = "image"
) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.warn(`Failed to destroy Cloudinary asset "${publicId}"`, error);
  }
};

export const deriveCloudinaryPublicId = (url: string): string | null => {
  try {
    const { pathname } = new URL(url);
    const marker = "/upload/";
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) return null;

    let publicId = pathname.slice(markerIndex + marker.length);
    publicId = publicId.replace(/^\//, "").replace(/^v\d+\//, "");

    const lastSlash = publicId.lastIndexOf("/");
    const lastDot = publicId.lastIndexOf(".");
    if (lastDot > lastSlash) publicId = publicId.slice(0, lastDot);

    return publicId || null;
  } catch {
    return null;
  }
};
