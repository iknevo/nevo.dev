import { Analytics } from "@vercel/analytics/next";
import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import type { Metadata } from "next";
import { JetBrains_Mono, Josefin_Sans } from "next/font/google";
import { headers } from "next/headers";

import Providers from "@/src/providers/providers";
import "@/src/styles/globals.css";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "nevo.is-a.dev";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return {
    title: {
      template: "NEVO | %s",
      default: "NEVO | Front-End Developer",
    },
    description:
      "Front-End developer building modern, responsive web applications and portfolios for the web. This is the personal portfolio of Ahmed (NEVO) Abdelhafiez.",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} ${jetbrainsMono.variable} relative bg-black text-white antialiased select-none`}
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
