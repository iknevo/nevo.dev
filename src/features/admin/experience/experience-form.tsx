import { Button } from "@/src/components/ui/button";
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
  expFormValues,
  experienceSchema,
} from "@/src/definitions/experience-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  id?: string;
  defaultValues?: expFormValues;
  onSubmit: (values: expFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function ExperienceForm({
  defaultValues,
  id,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
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
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="e.g. Google"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="startDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="e.g. 07/2025"
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
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="e.g. 10/2026"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full text-foreground" disabled={disabled}>
          {id ? "Save Changes" : "Create Experience"}
        </Button>

        {!!id && (
          <Button
            className="w-full text-foreground"
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={handleDelete}
          >
            <Trash className="size-4" />
            <span>Delete Experience</span>
          </Button>
        )}
      </form>
    </Form>
  );
}
