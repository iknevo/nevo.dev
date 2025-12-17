import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/src/components/ui/sheet";
import {
  stackFormDefaults,
  stackSchema
} from "@/src/definitions/stack-validations";

import { useCreateStackItem } from "./api/use-create-stack-item";
import StackForm from "./stack-form";
import { useNewStack } from "./state/use-new-stack";

type FormValues = z.input<typeof stackSchema>;

export const NewStackSheet = () => {
  const { isOpen, onClose } = useNewStack();
  const { mutate: createStackItem, isPending } = useCreateStackItem();
  const queryClient = useQueryClient();

  const onSubmit = (values: FormValues) => {
    createStackItem(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["stack"]
        });
        onClose();
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="dark space-y-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Stack Item</SheetTitle>
          <SheetDescription>Create a new skill or tool</SheetDescription>
        </SheetHeader>
        <StackForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={stackFormDefaults}
        />
      </SheetContent>
    </Sheet>
  );
};
