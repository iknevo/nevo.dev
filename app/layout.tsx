import Cursor from "@/app/_components/Cursor";
import StickyEmail from "@/app/_components/StickyEmail";
import "@/app/_styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import ScrollButton from "./_components/scroll-button";
import { Signature } from "./_components/signature";

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
          <main className="container-custom">{children}</main>
        </ReactLenis>
        <Cursor />
        <StickyEmail />

        <div className="max-xl:hidden absolute bottom-5 right-5 block">
          <ScrollButton scrollToTop />
        </div>
        <Signature />
        <Analytics />
      </body>
    </html>
  );
}
