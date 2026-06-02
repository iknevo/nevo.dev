"use client";

import { useEffect } from "react";

export function Signature() {
  useEffect(() => {
    const year = new Date().getFullYear();
    console.log(
      `%c NEVO %c © ${year} · Built with ❤️ %c https://nevo.is-a.dev `,
      "color:#fff; font-weight:800; font-size:13px; padding:6px 10px; border-radius:4px 0 0 4px; background:linear-gradient(135deg, #d84e2c, #ff6b3d);",
      "color:#d4d4d4; font-size:13px; padding:6px 10px; background:#1a1a1a;",
      "color:#a0a0a0; font-size:13px; padding:6px 10px; border-radius:0 4px 4px 0; background:#0d0d0d;"
    );
  }, []);
  return null;
}
