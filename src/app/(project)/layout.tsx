import "lenis/dist/lenis.css";

import Cursor from "@/src/components/cursor";
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
import ScrollProgressIndicator from "@/src/components/scroll-progress-indicator";
import StickyEmail from "@/src/components/sticky-email";
import "@/src/styles/globals.css";

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
      <Cursor />
      <StickyEmail />
    </>
  );
}
