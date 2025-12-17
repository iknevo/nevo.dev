import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { InputTags } from "@/src/components/ui/tags-input";
import { Textarea } from "@/src/components/ui/textarea";
import { blogFormValues, blogSchema } from "@/src/definitions/blog-validation";
import Editor from "@/src/features/code-editor/editor";
import Preview from "@/src/features/code-editor/preview";

type Props = {
  id?: string;
  defaultValues: blogFormValues;
  onSubmit: (values: blogFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function BlogForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
}: Props) {
  const form = useForm<blogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: defaultValues
  });
  const [doc, setDoc] = useState<string>(defaultValues.doc);
  const handleChangeDoc = useCallback((newDoc: string) => setDoc(newDoc), []);
  const handleSubmit = (values: blogFormValues) => {
    onSubmit(values);
  };
  const handleDelete = () => {
    onDelete?.();
    console.log("delete");
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoc(defaultValues.doc);
  }, [defaultValues.doc]);
  useEffect(() => {
    form.setValue("doc", doc, { shouldDirty: true });
  }, [doc, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="dark space-y-4"
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
                  placeholder="e.g. first blog post"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="summary"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={disabled}
                  placeholder="what is this all about"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="image"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
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
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <InputTags {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid min-h-100 grid-cols-1 gap-2 md:grid-cols-2">
          <Editor
            initialDoc={doc}
            onChange={handleChangeDoc}
            disabled={disabled}
          />
          <Preview doc={doc} />
        </div>

        <div className="flex justify-end gap-4">
          {!!id && (
            <Button
              className="text-white"
              type="button"
              variant="destructive"
              disabled={disabled}
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          )}
          <Button type="submit" className="text-white" disabled={disabled}>
            {id ? "Save Changes" : "Submit blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
