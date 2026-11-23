export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "4 MB";

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getUploadSizeError(file: File, kind = "Image") {
  return file.size > MAX_UPLOAD_BYTES ? `${kind} must be ${MAX_UPLOAD_LABEL} or smaller` : null;
}
