import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/src/components/ui/select";
import { STACK } from "@/src/config/constants";
import {
  stackFormValues,
  stackSchema
} from "@/src/definitions/stack-validations";

type Props = {
  id?: string;
  defaultValues?: stackFormValues;
  onSubmit: (values: stackFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function StackForm({
  defaultValues,
  id,
  onSubmit,
  onDelete,
  disabled
}: Props) {
  const form = useForm<stackFormValues>({
    resolver: zodResolver(stackSchema),
    defaultValues: defaultValues
  });
  const handleSubmit = (values: stackFormValues) => {
    onSubmit(values);
  };
  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
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
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file ?? new File([], ""));
                  }}
                  name={field.name}
                  ref={field.ref}
                  disabled={disabled}
                />
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
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
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
                    <SelectItem value={STACK.tools}>Tools</SelectItem>
                    <SelectItem value={STACK.studying}>Studying</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </form>
    </Form>
  );
}
