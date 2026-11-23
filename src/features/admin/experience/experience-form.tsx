import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldLabel } from "@/src/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { expFormValues, experienceSchema } from "@/src/definitions/experience-validations";
import FormSection from "@/src/features/admin/shared/form-section";

type Props = {
  formId: string;
  defaultValues: expFormValues;
  onSubmit: (values: expFormValues) => unknown;
  onDirtyChange?: (isDirty: boolean) => void;
  disabled?: boolean;
};

export default function ExperienceForm({
  formId,
  defaultValues,
  onSubmit,
  onDirtyChange,
  disabled,
}: Props) {
  const form = useForm<expFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });
  const { isDirty } = form.formState;
  const [isCurrentRole, setIsCurrentRole] = useState(
    defaultValues.endDate.toLowerCase() === "present"
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const setCurrentRole = (current: boolean) => {
    setIsCurrentRole(current);
    form.setValue("endDate", current ? "Present" : "", {
      shouldDirty: true,
      shouldValidate: current,
    });
    if (!current) setTimeout(() => form.setFocus("endDate"));
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormSection title="Role details">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={disabled}
                    placeholder="e.g. Full-Stack Developer · Full time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="company"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="e.g. Google" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Timeline" description="Dates use the MM/YYYY format.">
          <Field orientation="horizontal" className="justify-between">
            <FieldLabel htmlFor="experience-current-switch">I currently work here</FieldLabel>
            <Switch
              id="experience-current-switch"
              checked={isCurrentRole}
              onCheckedChange={setCurrentRole}
              disabled={disabled}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={disabled}
                      placeholder="MM/YYYY"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={disabled || isCurrentRole}
                      placeholder="MM/YYYY"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Controller
          name="hide"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal" className="justify-between">
              <FieldLabel htmlFor="experience-hide-switch">Hide experience</FieldLabel>
              <Switch
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                id="experience-hide-switch"
                disabled={disabled}
              />
            </Field>
          )}
        />
      </form>
    </Form>
  );
}
