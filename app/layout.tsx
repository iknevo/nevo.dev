import { ReactLenis } from "lenis/react";
import type { Metadata } from "next";
import { Anton, Roboto_Flex } from "next/font/google";

import "lenis/dist/lenis.css";
import CustomCursor from "./_components/CustomCursor";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import ParticleBackground from "./_components/ParticleBackground";
import Preloader from "./_components/Preloader";
import ScrollProgressIndicator from "./_components/ScrollProgressIndicator";
import StickyEmail from "./_components/StickyEmail";
import "./globals.css";

const antonFont = Anton({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-anton",
});

const robotoFlex = Roboto_Flex({
  weight: ["100", "400", "500", "600", "700", "800"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-roboto-flex",
});

export const metadata: Metadata = {
  title: "Portfolio - Tajmirul Islam",
  description: "Personal portfolio of Tajmirul Islam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${antonFont.variable} ${robotoFlex.variable} antialiased bg-black text-white`}
      >
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            duration: 1.4,
          }}
        >
          <Navbar />
          <main>{children}</main>
          <Footer />

          <CustomCursor />
          <Preloader />
          <ScrollProgressIndicator />
          <ParticleBackground />
          <StickyEmail />
        </ReactLenis>
      </body>
    </html>
  );
}
