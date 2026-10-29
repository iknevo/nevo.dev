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
import { Switch } from "@/src/components/ui/switch";
import { expFormValues, experienceSchema } from "@/src/definitions/experience-validations";

type Props = {
  id?: string;
  defaultValues?: expFormValues;
  onSubmit: (values: expFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function ExperienceForm({ defaultValues, id, onSubmit, onDelete, disabled }: Props) {
  const form = useForm<expFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues,
  });
  const handleSubmit = (values: expFormValues) => {
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
            Role details
          </h3>
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
                    placeholder="e.g. Full-Stack Developer - Full time"
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
        </div>

        <div className="space-y-4 border-t border-white/10 pt-5">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Timeline
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">Use MM/YYYY or Present.</p>
          </div>
          <FormField
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="MM/YYYY" inputMode="numeric" />
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
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={disabled}
                    placeholder="MM/YYYY or Present"
                    inputMode="text"
                  />
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
              Hidden experiences stay available here but are removed from the public site.
            </p>
          </div>
          <Controller
            name="hide"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="justify-between">
                <FieldLabel htmlFor="hide-switch">Hide experience</FieldLabel>
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
            {id ? "Save Changes" : "Create Experience"}
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
              <span>Delete Experience</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
