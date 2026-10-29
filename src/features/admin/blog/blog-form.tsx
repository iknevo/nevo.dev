import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2, Pencil, Trash, X } from "lucide-react";
import { type KeyboardEvent, useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import { InputTags } from "@/src/components/ui/tags-input";
import { Textarea } from "@/src/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { blogFormValues, blogSchema } from "@/src/definitions/blog-validation";
import ImagePreviewModal from "@/src/features/admin/shared/image-preview-modal";
import Editor from "@/src/features/code-editor/editor";
import Preview from "@/src/features/code-editor/preview";

type Props = {
  id?: string;
  defaultValues: blogFormValues;
  onSubmit: (values: blogFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function BlogForm({ id, defaultValues, onSubmit, onDelete, disabled }: Props) {
  const [doc, setDoc] = useState<string>(defaultValues.doc);
  const editTabRef = useRef<HTMLButtonElement>(null);
  const previewTabRef = useRef<HTMLButtonElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<blogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: defaultValues,
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const handleChangeDoc = useCallback(
    (newDoc: string) => {
      setDoc(newDoc);
      form.setValue("doc", newDoc, {
        shouldDirty: newDoc !== defaultValues.doc,
        shouldValidate: true,
      });
    },
    [defaultValues.doc, form]
  );

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setShowPreview(true);
      previewTabRef.current?.focus();
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setShowPreview(false);
      editTabRef.current?.focus();
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image", "", { shouldDirty: true, shouldValidate: true });
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = (values: blogFormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="dark space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} placeholder="e.g. first blog post" />
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
                  className="min-h-30"
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
                    ref={(node) => {
                      imageInputRef.current = node;
                      field.ref(node);
                    }}
                    disabled={disabled}
                    className="file:bg-primary file:mr-3 file:cursor-pointer file:rounded file:border-0 file:px-3 file:py-1.5 file:font-medium file:text-white"
                  />
                </FormControl>
                <ImagePreviewModal
                  value={field.value}
                  disabled={disabled}
                  className="absolute top-1/2 right-10 -translate-y-1/2"
                />
                {!!field.value && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Remove image"
                        disabled={disabled}
                        onClick={handleRemoveImage}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                      >
                        <X />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove image</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-muted-foreground truncate text-xs" aria-live="polite">
                {field.value instanceof File
                  ? `${field.value.name} · ${(field.value.size / 1024).toFixed(0)} KB`
                  : field.value
                    ? "Current image attached"
                    : "No image selected"}
              </p>
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

        <div className="grid min-h-100 gap-2">
          <div
            className="ml-auto flex w-fit rounded-md border border-white/10 p-1"
            role="tablist"
            aria-label="Blog content view"
          >
            <Button
              ref={editTabRef}
              id="blog-edit-tab"
              type="button"
              size="sm"
              variant={showPreview ? "ghost" : "secondary"}
              role="tab"
              aria-selected={!showPreview}
              aria-controls="blog-editor-panel"
              tabIndex={showPreview ? -1 : 0}
              onClick={() => setShowPreview(false)}
              onKeyDown={handleTabKeyDown}
              disabled={disabled}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              ref={previewTabRef}
              id="blog-preview-tab"
              type="button"
              size="sm"
              variant={showPreview ? "secondary" : "ghost"}
              role="tab"
              aria-selected={showPreview}
              aria-controls="blog-preview-panel"
              tabIndex={showPreview ? 0 : -1}
              onClick={() => setShowPreview(true)}
              onKeyDown={handleTabKeyDown}
              disabled={disabled}
            >
              <Eye className="size-4" />
              Preview
            </Button>
          </div>
          <div
            id="blog-editor-panel"
            role="tabpanel"
            aria-labelledby="blog-edit-tab"
            hidden={showPreview}
            tabIndex={0}
          >
            <Editor initialDoc={doc} onChange={handleChangeDoc} disabled={disabled} />
          </div>
          <div
            id="blog-preview-panel"
            role="tabpanel"
            aria-labelledby="blog-preview-tab"
            hidden={!showPreview}
            className="h-[70vh] min-h-100 overflow-hidden rounded-sm border border-white/10"
          >
            <div
              tabIndex={0}
              data-lenis-prevent
              className="h-full overflow-y-auto overscroll-contain"
            >
              <Preview
                doc={doc}
                className="!h-auto !max-h-none !overflow-visible !rounded-none !border-0"
              />
            </div>
          </div>
          <FormField name="doc" control={form.control} render={() => <FormMessage />} />
        </div>

        <div className="flex flex-col-reverse gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {!!id && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    aria-label="Delete post"
                    disabled={disabled}
                    onClick={handleDelete}
                  >
                    <Trash className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete post</TooltipContent>
              </Tooltip>
            )}

            <Controller
              name="hide"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={field.value ? "Make post visible" : "Hide post"}
                        aria-pressed={!field.value}
                        disabled={disabled}
                        onClick={() => field.onChange(!field.value)}
                      >
                        {field.value ? (
                          <EyeClosed className="text-muted-foreground size-5" />
                        ) : (
                          <Eye className="text-foreground size-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {field.value ? "Make post visible" : "Hide post"}
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-muted-foreground text-sm">
                    {field.value ? "Hidden" : "Visible"}
                  </span>
                </div>
              )}
            />
          </div>

          <Button type="submit" className="text-white" disabled={disabled}>
            {disabled && <Loader2 className="size-4 animate-spin" />}
            {disabled ? "Saving..." : id ? "Save Changes" : "Submit blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
