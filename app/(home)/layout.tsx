import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import ParticleBackground from "@/app/_components/ParticleBackground";
import Preloader from "@/app/_components/Preloader";
import ScrollProgressIndicator from "@/app/_components/ScrollProgressIndicator";
import "@/app/_styles/globals.css";
import "lenis/dist/lenis.css";
import ScrollButton from "../_components/scroll-button";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="container-custom relative">{children}</main>
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
