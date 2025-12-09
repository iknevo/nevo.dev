import Providers from "@/src/providers/providers";
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
  description:
    "Front-End developer building modern, responsive web applications and portfolios for the web. This is the personal portfolio of Ahmed (NEVO) Abdelhafiez.",
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
        className={`${josefin.className} select-none relative antialiased bg-black text-white`}
      >
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            duration: 1.4,
          }}
        >
          <main>
            <Providers>{children}</Providers>
          </main>
        </ReactLenis>
        <Analytics />
      </body>
    </html>
  );
}
