import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import ParticleBackground from "@/app/_components/ParticleBackground";
import Preloader from "@/app/_components/Preloader";
import ScrollProgressIndicator from "@/app/_components/ScrollProgressIndicator";
import "@/app/_styles/globals.css";
import "lenis/dist/lenis.css";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="container-custom">{children}</main>
      <Footer />
      <ScrollProgressIndicator />
      <Preloader />
      <ParticleBackground />
    </>
  );
}
