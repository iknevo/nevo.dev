"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Field, FieldLabel } from "@/src/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { ProfileSchema, ProfileValues } from "@/src/definitions/profile-validations";

import { useUpdateProfile } from "./api/use-update-profile";

type Props = {
  profile: ProfileValues;
};

export default function ProfileForm({ profile }: Props) {
  const updateMutation = useUpdateProfile();
  const { isPending } = updateMutation;

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: profile,
  });
  const { isDirty } = form.formState;

  const handleSubmit = async (values: ProfileValues) => {
    try {
      const { message, data } = await updateMutation.mutateAsync(values);
      toast.success(message);
      form.reset(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't update the profile.");
    }
  };

  return (
    <div className="dark rounded-lg border border-white/10 p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          <FormField
            name="openToWork"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="justify-between">
                <FieldLabel htmlFor="profile-open-to-work">Open to work</FieldLabel>
                <Switch
                  id="profile-open-to-work"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </Field>
            )}
          />
          <FormField
            name="note"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability note</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Open to remote roles or relocation"
                  />
                </FormControl>
                <FormDescription>Shown next to the badge while open to work.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="City, Country" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="timezone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="UTC+2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending || !isDirty}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button type="submit" disabled={isPending || !isDirty} className="text-white">
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
