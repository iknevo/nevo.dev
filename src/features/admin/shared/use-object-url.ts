import { useEffect, useState } from "react";

export function useObjectUrl(value: string | File | null | undefined): string | null {
  const [blob, setBlob] = useState<{ file: File; url: string } | null>(null);
  const file = value instanceof File && value.size > 0 ? value : null;

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlob({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (value instanceof File) return blob?.file === file ? blob.url : null;
  return value?.trim() || null;
}
