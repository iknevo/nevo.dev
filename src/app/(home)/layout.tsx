import Cursor from "@/src/components/cursor";
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
import ParticleBackground from "@/src/components/particle-background";
import Preloader from "@/src/components/preloader";
import ScrollButton from "@/src/components/scroll-button";
import ScrollProgressIndicator from "@/src/components/scroll-progress-indicator";
import StickyEmail from "@/src/components/sticky-email";
import "@/src/styles/globals.css";
import "lenis/dist/lenis.css";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col">
        <main className="relative flex-1">{children}</main>
        <Footer />
      </div>
      <ScrollProgressIndicator />
      <Preloader />
      <Cursor />
      <StickyEmail />
      <ParticleBackground />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="right-6 bottom-6 hidden xl:absolute xl:block">
          <ScrollButton scrollToTop />
        </div>
      </div>
    </>
  );
}
