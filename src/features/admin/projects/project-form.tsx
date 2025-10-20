import { Button } from "@/src/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/src/components/ui/field";
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
import { Textarea } from "@/src/components/ui/textarea";
import {
  CreateProjectFormValues,
  CreateProjectSchema,
} from "@/src/definitions/projects.validations";
// import { insertAccountSchema } from "@/src/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash, XIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type Props = {
  id?: string;
  defaultValues?: CreateProjectFormValues;
  onSubmit: (values: CreateProjectFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function ProjectForm({
  defaultValues,
  id,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: defaultValues,
  });
  const {
    fields: techStackFields,
    append: addTechStack,
    remove: removeTechStack,
  } = useFieldArray({
    name: "techStack",
    control: form.control,
  });
  const {
    fields: featuresFields,
    append: addFeature,
    remove: removeFeature,
  } = useFieldArray({
    name: "features",
    control: form.control,
  });

  const {
    fields: imagesFields,
    append: addImage,
    remove: removeImage,
  } = useFieldArray({
    name: "images",
    control: form.control,
  });
  const handleSubmit = (values: CreateProjectFormValues) => {
    console.log(values);

    // onSubmit(values);
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
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="e.g. My Awesome Project"
                />
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
                  placeholder="2025"
                  onChange={(e) => field.onChange(e.target.value.toString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="liveUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="preview url"
                />
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
                <Input {...field} disabled={disabled} placeholder="code url" />
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
                  disabled={disabled}
                  placeholder="what is this all about"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="thumbnail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
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

        <FieldSet className="gap-4">
          <FieldLegend variant="label">Images</FieldLegend>
          <FieldDescription>add project&apos;s images</FieldDescription>
          <FieldGroup className="gap-4">
            {imagesFields.map((field, index) => (
              <Controller
                key={field.id}
                name={`images.${index}.item`}
                control={form.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <FieldContent className="flex-1 w-full">
                      <InputGroup>
                        <InputGroupInput
                          type="file"
                          disabled={disabled}
                          accept="image/*"
                          id={`image-input-${index}`}
                          onChange={(e) =>
                            controllerField.onChange(
                              e.target.files?.[0] ?? undefined
                            )
                          }
                          name={controllerField.name}
                          ref={controllerField.ref}
                          className="flex-1 w-full"
                        />
                        {imagesFields.length > 1 && (
                          <InputGroupAddon align={"inline-end"}>
                            <InputGroupButton
                              type="button"
                              disabled={disabled}
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => removeImage(index)}
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="mb-2"
              onClick={() => addImage({ item: new File([], "") })}
            >
              Add Image
            </Button>
          </FieldGroup>
          {form.formState.errors.images?.root && (
            <FieldError errors={[form.formState.errors.images.root]} />
          )}
        </FieldSet>

        <FieldSet className="gap-4">
          <FieldLegend variant="label">Features</FieldLegend>
          <FieldDescription>add project&apos;s features</FieldDescription>
          <FieldGroup className="gap-4">
            {featuresFields.map((field, index) => (
              <Controller
                key={field.id}
                name={`features.${index}.item`}
                control={form.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <FieldContent className="flex-1 w-full">
                      <InputGroup>
                        <InputGroupInput
                          {...controllerField}
                          id={`form-rhf-array-feature-${index}`}
                          aria-invalid={fieldState.invalid}
                          placeholder="feature"
                          type="text"
                          className="flex-1 w-full"
                          disabled={disabled}
                        />
                        {featuresFields.length > 1 && (
                          <InputGroupAddon align={"inline-end"}>
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => removeFeature(index)}
                              disabled={disabled}
                              aria-label={`Remove feature ${index + 1}`}
                            >
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              size="sm"
              className="mb-2"
              onClick={() => addFeature({ item: "" })}
            >
              Add Feature
            </Button>
          </FieldGroup>
          {form.formState.errors.features?.root && (
            <FieldError errors={[form.formState.errors.features.root]} />
          )}
        </FieldSet>

        <FieldSet className="gap-4">
          <FieldLegend variant="label">Tech Stack</FieldLegend>
          <FieldDescription>add technologies used</FieldDescription>
          <FieldGroup className="gap-4">
            {techStackFields.map((field, index) => (
              <Controller
                key={field.id}
                name={`techStack.${index}.item`}
                control={form.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <FieldContent className="flex-1 w-full">
                      <InputGroup>
                        <InputGroupInput
                          {...controllerField}
                          id={`form-rhf-array-technology-${index}`}
                          aria-invalid={fieldState.invalid}
                          placeholder="technology"
                          type="text"
                          disabled={disabled}
                          className="flex-1 w-full"
                        />
                        {techStackFields.length > 1 && (
                          <InputGroupAddon align={"inline-end"}>
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => removeTechStack(index)}
                              disabled={disabled}
                              aria-label={`Remove technology ${index + 1}`}
                            >
                              <XIcon />
                            </InputGroupButton>
                          </InputGroupAddon>
                        )}
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-2"
              disabled={disabled}
              onClick={() => addTechStack({ item: "" })}
            >
              Add Technology
            </Button>
          </FieldGroup>
          {form.formState.errors.techStack?.root && (
            <FieldError errors={[form.formState.errors.techStack.root]} />
          )}
        </FieldSet>

        <Button className="w-full text-foreground" disabled={disabled}>
          {id ? "Save Changes" : "Create Project"}
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
            <span>Delete Project</span>
          </Button>
        )}
      </form>
    </Form>
  );
}
