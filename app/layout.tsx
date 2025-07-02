import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import ParticleBackground from "./_components/ParticleBackground";
import Preloader from "./_components/Preloader";
import ScrollProgressIndicator from "./_components/ScrollProgressIndicator";
import StickyEmail from "./_components/StickyEmail";
import "./globals.css";

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
          <Navbar />
          <main className="container-custom">{children}</main>
          <Footer />
          <Preloader />
          <ScrollProgressIndicator />
          <ParticleBackground />
          <StickyEmail />
        </ReactLenis>
      </body>
    </html>
  );
}
