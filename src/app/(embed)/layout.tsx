import Cursor from "@/src/components/cursor";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Cursor />
    </>
  );
}
