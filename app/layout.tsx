import Cursor from "@/app/_components/Cursor";
import StickyEmail from "@/app/_components/StickyEmail";
import "@/app/_styles/globals.css";
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
  title: "NEVO | Front-End Developer",
  description: "Personal portfolio of Ahmed (NEVO) Abdelhafiez",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} select-none font-roboto-flex antialiased bg-black text-white`}
      >
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            duration: 1.4,
          }}
        >
          <main className="container-custom">{children}</main>
        </ReactLenis>
        <Cursor />
        <StickyEmail />
        <Analytics />
      </body>
    </html>
  );
}
