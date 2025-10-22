import "@/src/styles/globals.css";
import "lenis/dist/lenis.css";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <main className="relative">{children}</main>
    </>
  );
}
