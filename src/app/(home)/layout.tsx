import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
import ParticleBackground from "@/src/components/particle-background";
import Preloader from "@/src/components/preloader";
import ScrollButton from "@/src/components/scroll-button";
import ScrollProgressIndicator from "@/src/components/scroll-progress-indicator";
import "@/src/styles/globals.css";
import "lenis/dist/lenis.css";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="relative">{children}</main>
      <Footer />
      <ScrollProgressIndicator />
      <Preloader />
      <ParticleBackground />
      <div className="max-xl:hidden absolute bottom-5 right-15 block">
        <ScrollButton scrollToTop />
      </div>
    </>
  );
}
