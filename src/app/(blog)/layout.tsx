import Cursor from "@/src/components/cursor";
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
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
      <main className="relative">{children}</main>
      <Footer />
      <ScrollProgressIndicator />
      <Cursor />
      <StickyEmail />
      <div className="container relative">
        <div className="hidden absolute bottom-5 -right-30 xl:block">
          <ScrollButton scrollToTop />
        </div>
      </div>
    </>
  );
}
