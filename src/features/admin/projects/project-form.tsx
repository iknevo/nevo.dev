import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, XIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/src/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/src/components/ui/field";
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/src/components/ui/input-group";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { projectFormValues, projectSchema } from "@/src/definitions/projects-validations";
import { getUploadSizeError } from "@/src/definitions/upload";
import FormSection from "@/src/features/admin/shared/form-section";
import ImagePreviewModal from "@/src/features/admin/shared/image-preview-modal";

import SkillsSelect from "./skills-select";

type Props = {
  formId: string;
  defaultValues: projectFormValues;
  onSubmit: (values: projectFormValues) => unknown;
  onDirtyChange?: (isDirty: boolean) => void;
  disabled?: boolean;
};

export default function ProjectForm({
  formId,
  defaultValues,
  onSubmit,
  onDirtyChange,
  disabled,
}: Props) {
  const form = useForm<projectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormSection title="Project details">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="e.g. My Awesome Project" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="year"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={disabled}
                    inputMode="numeric"
                    placeholder={new Date().getFullYear().toString()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    disabled={disabled}
                    placeholder="What is this project about?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Links & media">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="liveUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" disabled={disabled} placeholder="https://" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="sourceCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repo URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      disabled={disabled}
                      placeholder="https://github.com/…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="thumbnail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
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
                          form.setError("thumbnail", { message: sizeError });
                          return;
                        }
                        form.clearErrors("thumbnail");
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

        <FormSection title="Features">
          <ListField
            form={form}
            name="features"
            itemLabel="feature"
            placeholder="e.g. Real-time collaboration"
            addLabel="Add feature"
            disabled={disabled}
          />
        </FormSection>

        <FormSection title="Tech stack">
          <FormField
            name="techStack"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SkillsSelect
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <Controller
          name="hide"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal" className="justify-between">
              <FieldLabel htmlFor="project-hide-switch">Hide project</FieldLabel>
              <Switch
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                id="project-hide-switch"
                disabled={disabled}
              />
            </Field>
          )}
        />
      </form>
    </Form>
  );
}

type ListFieldProps = {
  form: ReturnType<typeof useForm<projectFormValues>>;
  name: "features";
  itemLabel: string;
  placeholder: string;
  addLabel: string;
  disabled?: boolean;
};

function ListField({ form, name, itemLabel, placeholder, addLabel, disabled }: ListFieldProps) {
  const { fields, append, remove } = useFieldArray({ name, control: form.control });
  const rootError = form.formState.errors[name]?.root ?? form.formState.errors[name];

  return (
    <div className="space-y-3">
      {fields.map((item, index) => (
        <Controller
          key={item.id}
          name={`${name}.${index}.item`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={`project-${name}-${index}`}
                  aria-label={`${itemLabel} ${index + 1}`}
                  aria-invalid={fieldState.invalid}
                  placeholder={placeholder}
                  disabled={disabled}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    if (index < fields.length - 1) {
                      form.setFocus(`${name}.${index + 1}.item`);
                    } else if (field.value.trim()) {
                      append({ item: "" });
                    }
                  }}
                />
                {fields.length > 1 && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => remove(index)}
                      disabled={disabled}
                      aria-label={`Remove ${itemLabel} ${index + 1}`}
                    >
                      <XIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => append({ item: "" })}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <Plus />
        {addLabel}
      </Button>
      {rootError && "message" in rootError && typeof rootError.message === "string" && (
        <FieldError errors={[{ message: rootError.message }]} />
      )}
    </div>
  );
}
