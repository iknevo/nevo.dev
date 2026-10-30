import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/src/components/ui/button";
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
import { STACK } from "@/src/config/constants";
import { stackFormValues, stackSchema } from "@/src/definitions/stack-validations";
import ImagePreviewModal from "@/src/features/admin/shared/image-preview-modal";

type Props = {
  id?: string;
  defaultValues?: stackFormValues;
  onSubmit: (values: stackFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function StackForm({ defaultValues, id, onSubmit, onDelete, disabled }: Props) {
  const form = useForm<stackFormValues>({
    resolver: zodResolver(stackSchema),
    defaultValues: defaultValues,
  });
  const handleSubmit = (values: stackFormValues) => {
    onSubmit(values);
  };
  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
            Skill details
          </h3>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="e.g. HTML" />
                </FormControl>
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
                        field.onChange(file ?? field.value);
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

          <FormField
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className="w-full"
                      id="form-select-type"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Front-End" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={STACK.frontend}>Front-End</SelectItem>
                      <SelectItem value={STACK.backend}>Back-End</SelectItem>
                      <SelectItem value={STACK.mobile}>Mobile</SelectItem>
                      <SelectItem value={STACK.testing}>Testing</SelectItem>
                      <SelectItem value={STACK.tools}>Tools</SelectItem>
                      <SelectItem value={STACK.studying}>Studying</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 border-t border-white/10 pt-5">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Visibility
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Hidden skills stay available here but are removed from the public site.
            </p>
          </div>
          <Controller
            name="hide"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="justify-between">
                <FieldLabel htmlFor="hide-switch">Hide skill</FieldLabel>
                <Switch
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="hide-switch"
                  disabled={disabled}
                />
              </Field>
            )}
          />
        </div>

        <div className="bg-background/95 sticky bottom-0 z-10 -mx-1 space-y-2 border-t border-white/10 py-4 backdrop-blur">
          <Button className="text-foreground w-full" disabled={disabled}>
            {id ? "Save Changes" : "Create Stack Item"}
          </Button>

          {!!id && (
            <Button
              className="text-foreground w-full"
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={handleDelete}
            >
              <Trash className="size-4" />
              <span>Delete Stack Item</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
