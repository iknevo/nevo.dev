import { Button } from "./ui/button";

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  asChild?: boolean;
}
export default function AdminSectionButton({ children, onClick, asChild = false }: Props) {
  return (
    <Button
      className="dark flex items-center justify-center text-sm font-semibold md:text-lg"
      variant={"outline"}
      onClick={onClick}
      asChild={asChild}
    >
      {children}
    </Button>
  );
}
