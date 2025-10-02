import Cursor from "@/src/components/cursor";
import { Signature } from "@/src/components/me/signature";
import StickyEmail from "@/src/components/sticky-email";
import "@/src/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "NEVO | %s",
    default: "NEVO | Front-End Developer",
  },
  description: "Personal portfolio of Ahmed (NEVO) Abdelhafiez",
  metadataBase: new URL("https://nevo.is-a.dev"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} select-none relative font-roboto-flex antialiased bg-black text-white`}
      >
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            duration: 1.4,
          }}
        >
          <main>{children}</main>
        </ReactLenis>
        <Cursor />
        <StickyEmail />
        <Signature />
        <Analytics />
      </body>
    </html>
  );
}
