import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

export default function AuthCard({ title, description, children }: Props) {
  return (
    <div className="dark w-full max-w-md px-4">
      <div className="space-y-8 rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur-sm md:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-wide uppercase">{title}</h1>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
