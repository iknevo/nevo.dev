"use client";

import { Eye, EyeClosed } from "lucide-react";
import * as React from "react";

import { Button } from "@/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";

const InputPassword = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function InputPassword({ className, disabled, ...props }, ref) {
    const [showPass, setShowPass] = React.useState(false);
    const handleShowPassword = () => setShowPass((show) => !show);
    const inputType = showPass ? "text" : "password";
    const actionLabel = showPass ? "Hide password" : "Show password";

    return (
      <div className="relative items-center">
        <input
          ref={ref}
          type={inputType}
          data-slot="input"
          disabled={disabled}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-11 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleShowPassword}
              disabled={disabled}
              aria-label={actionLabel}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2"
            >
              {showPass ? <EyeClosed /> : <Eye />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{actionLabel}</TooltipContent>
        </Tooltip>
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

export { InputPassword };
