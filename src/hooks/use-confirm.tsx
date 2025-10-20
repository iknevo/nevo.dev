import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { JSX, useState } from "react";
import { Button } from "../components/ui/button";

type Options = {
  title: string;
  message: string;
};
export default function useConfirm(): [
  () => JSX.Element,
  ({ title, message }: Options) => Promise<boolean>,
] {
  const [promise, setPromise] = useState<((value: boolean) => void) | null>(
    null
  );
  const [options, setOptions] = useState<Options | null>(null);

  function confirm({ title, message }: Options) {
    setOptions({ title, message });
    return new Promise<boolean>((resolve) => {
      setPromise(() => resolve);
    });
  }
  function handleClose() {
    setPromise(null);
    setOptions(null);
  }
  function handleConfirm() {
    promise?.(true);
    handleClose();
  }

  function handleCancel() {
    promise?.(false);
    handleClose();
  }
  const ConfirmationDialog = () => (
    <AlertDialog open={!!promise}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          <AlertDialogDescription>{options?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-2">
          <Button onClick={handleCancel} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant={"destructive"}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return [ConfirmationDialog, confirm];
}
