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
  expFormDefaults,
  experienceSchema
} from "@/src/definitions/experience-validations";

import { useCreateExperience } from "./api/use-create-experience";
import ExperienceForm from "./experience-form";
import { useNewExperience } from "./state/use-new-experience";

type FormValues = z.input<typeof experienceSchema>;

export const NewExperienceSheet = () => {
  const { isOpen, onClose } = useNewExperience();
  const { mutate: createExp, isPending } = useCreateExperience();
  const queryClient = useQueryClient();

  const onSubmit = (values: FormValues) => {
    createExp(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["experience"]
        });
        onClose();
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="dark space-y-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Experience</SheetTitle>
          <SheetDescription>Create a new experience</SheetDescription>
        </SheetHeader>
        <ExperienceForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={expFormDefaults}
        />
      </SheetContent>
    </Sheet>
  );
};
