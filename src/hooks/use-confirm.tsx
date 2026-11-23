import { type ReactNode, useCallback, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";

type Options = {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
};

export function useConfirm(): [ReactNode, (options: Options) => Promise<boolean>] {
  const [options, setOptions] = useState<Options | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((next: Options) => {
    resolveRef.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const settle = (value: boolean) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setOptions(null);
  };

  const confirmDialog = (
    <AlertDialog open={!!options} onOpenChange={(open) => !open && settle(false)}>
      <AlertDialogContent className="dark">
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          <AlertDialogDescription>{options?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-2">
          <Button onClick={() => settle(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => settle(true)}
            variant={options?.destructive === false ? "default" : "destructive"}
            className={options?.destructive === false ? "text-white" : undefined}
          >
            {options?.confirmLabel ?? "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [confirmDialog, confirm];
}
