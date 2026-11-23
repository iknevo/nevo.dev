"use client";

import { Loader2, Trash, XIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { useConfirm } from "@/src/hooks/use-confirm";
import { cn } from "@/src/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  formId: string;
  submitLabel: string;
  isPending?: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
  isDirty?: boolean;
  submitDisabled?: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
  size?: "md" | "lg";
  children: ReactNode;
};

export default function FormSheet({
  open,
  onClose,
  title,
  description,
  formId,
  submitLabel,
  isPending = false,
  isSaving = false,
  isDeleting = false,
  isDirty = false,
  submitDisabled = false,
  onDelete,
  deleteLabel = "Delete",
  size = "md",
  children,
}: Props) {
  const [confirmDialog, confirm] = useConfirm();
  const busy = isPending || isSaving || isDeleting;

  const requestClose = async () => {
    if (busy) return;
    if (isDirty) {
      const ok = await confirm({
        title: "Discard changes?",
        message: "You have unsaved changes. They'll be lost if you close this panel.",
        confirmLabel: "Discard",
      });
      if (!ok) return;
    }
    onClose();
  };

  return (
    <>
      {confirmDialog}
      <Sheet open={open} onOpenChange={(next) => !next && requestClose()}>
        <SheetContent
          showCloseButton={false}
          className={cn(
            "dark gap-0 overflow-hidden p-0 sm:max-w-lg",
            size === "lg" && "md:max-w-xl"
          )}
        >
          <SheetHeader className="flex-row items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="min-w-0 space-y-1">
              <SheetTitle className="text-lg">{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close"
              disabled={busy}
              onClick={requestClose}
              className="text-muted-foreground hover:text-foreground -mt-1 -mr-2 shrink-0"
            >
              <XIcon />
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">{children}</div>

          <div className="bg-background flex items-center gap-2 border-t border-white/10 px-6 py-4">
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={onDelete}
                aria-label={deleteLabel}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive -ml-3"
              >
                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
                <span className="max-sm:sr-only">{deleteLabel}</span>
              </Button>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="outline" disabled={busy} onClick={requestClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form={formId}
                disabled={busy || submitDisabled}
                className="min-w-28 text-white"
              >
                {isSaving && <Loader2 className="animate-spin" />}
                {isSaving ? "Saving..." : submitLabel}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function FormSheetLoading() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" aria-label="Loading" />
    </div>
  );
}

export function FormSheetError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-white/15 px-6 py-10 text-center">
      <p className="text-muted-foreground text-sm">{message}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
