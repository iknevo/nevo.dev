"use client";
import { useEffect } from "react";

export function Signature() {
  useEffect(() => {
    console.log(
      "%c Developed with ❤️ by NEVO %c https://nevo.is-a.dev",
      "border:1px solid #000;color:#000;background:#ff0000;padding:5px 0;",
      "color: #fff; background: #1c1c1c; padding:5px 0;border: 1px solid #000;"
    );
  }, []);
  return null;
}
