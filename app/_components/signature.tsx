"use client";
import { useEffect } from "react";

export function Signature() {
  useEffect(() => {
    console.log(
      "%c NEVO %c Developed with ❤️ %c https://nevo.is-a.dev ",
      "color:#fff; font-weight:bold; font-size:14px; padding:8px 12px; border-radius:6px 0 0 6px; background:linear-gradient(135deg, #ff0000, #ff4b2b);",
      "color:#fff; font-size:14px; padding:8px 12px; background:linear-gradient(135deg, #1d2b64, #f8cdda);",
      "font-size:14px; padding:8px 12px; border-radius:0 6px 6px 0; background:#1c1c1c;"
    );
  }, []);
  return null;
}
