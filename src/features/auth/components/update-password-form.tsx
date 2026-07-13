"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Button from "@/src/components/button";
import SectionTitle from "@/src/components/section-title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { InputPassword } from "@/src/components/ui/input-password";
import { PasswordUpdateSchema } from "@/src/definitions/auth-validations";
import { useMe } from "@/src/features/auth/api/use-me";
import { useUpdatePassword } from "@/src/features/auth/api/use-update-password";

type FormValues = z.input<typeof PasswordUpdateSchema>;
export default function UpdatePasswordForm() {
  const meQuery = useMe();
  const updateMutation = useUpdatePassword();
  const { isPending } = updateMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      passwordCurrent: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const handleSubmit = (values: FormValues) => {
    updateMutation.mutate(values, {
      onSuccess: ({ message }) => {
        toast.success(message);
        form.reset();
      },
    });
  };

  const passwordChangedAt = meQuery.data?.user.passwordChangedAt;

  return (
    <div className="container pb-10">
      <div className="mb-10 flex items-center justify-between">
        <SectionTitle title="UPDATE PASSWORD" className="mb-0" />
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="dark space-y-5 rounded-lg border p-8 md:col-span-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="gap-6 flex flex-col">
              <FormField
                name="passwordCurrent"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex min-h-5 items-center justify-between">
                      <FormLabel>Current Password</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <InputPassword
                        {...field}
                        disabled={isPending}
                        placeholder="current password"
                        className="md:py-5"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex min-h-5 items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <InputPassword
                        {...field}
                        disabled={isPending}
                        placeholder="password"
                        className="md:py-5"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="passwordConfirm"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex min-h-5 items-center justify-between">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <InputPassword
                        {...field}
                        disabled={isPending}
                        placeholder="confirm your password"
                        className="md:py-5"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                as="button"
                disabled={isPending}
                className="cursor mt-9 self-end rounded-md font-semibold text-white transition-colors duration-500 hover:text-black"
              >
                Update
              </Button>
            </form>
          </Form>
        </div>

        <div className="dark space-y-5 rounded-lg border p-8 md:col-span-4">
          <h3 className="text-lg font-semibold">Last Changed</h3>
          {passwordChangedAt ? (
            <p className="text-muted-foreground">
              Your password was last updated on{" "}
              <span className="text-white">
                {new Date(passwordChangedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Your password has not been changed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
