import { cn } from "@/app/_lib/utils";
import { Variant } from "@/app/_types";
import Link from "next/link";
import React, { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  as?: "link" | "button";
  loading?: boolean;
  icon?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
  variant?: Variant;
} & (ComponentProps<typeof Link> | ButtonProps);

const Button = ({
  loading,
  variant,
  className,
  children,
  as = "link",
  ...rest
}: Props) => {
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
    "no-color": "",
  }[variant || "primary"];

  const iconClasses = cn(
    "min-w-9 aspect-square text-xl p-0 inline-flex items-center justify-center rounded-md",
    variantClasses
  );

  const buttonClasses = cn(
    `group h-12 px-8 inline-flex justify-center items-center gap-2 text-lg uppercase tracking-widest outline-none transition-colors relative overflow-hidden`,
    variantClasses,
    className
  );

  if (as === "link") {
    const props = rest as ComponentProps<typeof Link>;

    if (props.target === "_blank") {
      return (
        <a
          className={buttonClasses}
          {...props}
          href={props.href.toString() || "#"}
        >
          {variant !== "link" && (
            <span className="absolute top-[200%] left-0 right-0 h-full bg-white rounded-[50%] group-hover:top-0 transition-all duration-500 scale-150"></span>
          )}
          <span className="z-1">{children}</span>
        </a>
      );
    }

    return (
      <Link className={buttonClasses} {...props} href={props.href || "#"}>
        {variant !== "link" && (
          <span className="absolute top-[200%] left-0 right-0 h-full bg-white rounded-[50%] group-hover:top-0 transition-all duration-500 scale-150"></span>
        )}
        <span className="z-1">{children}</span>
      </Link>
    );
  } else if (as === "button") {
    const props = rest as ButtonProps;

    return (
      <button className={buttonClasses} {...props}>
        {variant !== "link" && (
          <span className="absolute top-[200%] left-0 right-0 h-full bg-white rounded-[50%] group-hover:top-0 transition-all duration-500 scale-150"></span>
        )}
        <span className="z-1">{children}</span>
      </button>
    );
  }
};

export default Button;
