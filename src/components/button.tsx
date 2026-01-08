import Link from "next/link";
import { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import { Variant } from "@/src/types";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  as?: "link" | "button";
  children: ReactNode | ReactNode[];
  className?: string;
  variant?: Variant;
} & (ComponentProps<typeof Link> | ButtonProps);

export default function Button({
  variant,
  className,
  children,
  as = "link",
  ...rest
}: Props) {
  const variantClasses = {
    primary: `bg-primary text-black font-semibold  hover:bg-primary`,
    secondary: `bg-secondary text-secondary-foreground hover:bg-secondary-hover`,
    success: `bg-green-500 text-white hover:bg-green-600`,
    warning: `bg-orange-500 text-white hover:bg-orange-600`,
    danger: `bg-destructive text-destructive-foreground hover:bg-destructive/70`,
    info: `bg-blue-500 text-white hover:bg-blue-600`,
    light: `bg-background-active text-foreground hover:bg-background-active`,
    dark: `bg-foreground text-background hover:bg-foreground/80`,
    link: `text-foreground hover:text-primary`,
    "no-color": ""
  }[variant || "primary"];

  const buttonClasses = cn(
    `group h-12 px-8 inline-flex justify-center items-center gap-2 text-lg uppercase tracking-widest outline-none transition-colors relative overflow-hidden`,
    variantClasses,
    className
  );

  if (as === "link") {
    const props = rest as ComponentProps<typeof Link>;

    if (props.target === "_blank") {
      return (
        <Link
          className={buttonClasses}
          {...props}
          href={props.href.toString() || "#"}
          rel="noreferrer noopener"
        >
          {variant !== "link" && (
            <span className="absolute top-[200%] right-0 left-0 h-full scale-150 rounded-[50%] bg-white transition-all duration-500 group-hover:top-0"></span>
          )}
          <span className="z-1">{children}</span>
        </Link>
      );
    }

    return (
      <Link className={buttonClasses} {...props} href={props.href || "#"}>
        {variant !== "link" && (
          <span className="absolute top-[200%] right-0 left-0 h-full scale-150 rounded-[50%] bg-white transition-all duration-500 group-hover:top-0"></span>
        )}
        <span className="z-1">{children}</span>
      </Link>
    );
  } else if (as === "button") {
    const props = rest as ButtonProps;

    return (
      <button className={buttonClasses} {...props}>
        {variant !== "link" && (
          <span className="absolute top-[200%] right-0 left-0 h-full scale-150 rounded-[50%] bg-white transition-all duration-500 group-hover:top-0"></span>
        )}
        <span className="z-1">{children}</span>
      </button>
    );
  }
}
