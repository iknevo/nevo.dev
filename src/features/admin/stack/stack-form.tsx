import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { STACK_TYPE_OPTIONS } from "@/src/config/constants";
import { stackFormValues, stackSchema } from "@/src/definitions/stack-validations";
import { getUploadSizeError } from "@/src/definitions/upload";
import FormSection from "@/src/features/admin/shared/form-section";
import ImagePreviewModal from "@/src/features/admin/shared/image-preview-modal";

type Props = {
  formId: string;
  defaultValues: stackFormValues;
  onSubmit: (values: stackFormValues) => unknown;
  onDirtyChange?: (isDirty: boolean) => void;
  disabled?: boolean;
};

export default function StackForm({
  formId,
  defaultValues,
  onSubmit,
  onDirtyChange,
  disabled,
}: Props) {
  const form = useForm<stackFormValues>({
    resolver: zodResolver(stackSchema),
    defaultValues,
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormSection title="Skill details">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="e.g. TypeScript" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Front-End" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STACK_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="icon"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const sizeError = getUploadSizeError(file);
                        if (sizeError) {
                          e.target.value = "";
                          form.setError("icon", { message: sizeError });
                          return;
                        }
                        form.clearErrors("icon");
                        field.onChange(file);
                      }}
                      name={field.name}
                      ref={field.ref}
                      disabled={disabled}
                    />
                  </FormControl>
                  <ImagePreviewModal
                    value={field.value}
                    fit="contain"
                    disabled={disabled}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Visibility"
          description="Hidden skills stay available here but are removed from the public site."
        >
          <Controller
            name="hide"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="justify-between">
                <FieldLabel htmlFor="stack-hide-switch">Hide skill</FieldLabel>
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="stack-hide-switch"
                  disabled={disabled}
                />
              </Field>
            )}
          />
        </FormSection>
      </form>
    </Form>
  );
}
