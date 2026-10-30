"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import SectionTitle from "@/src/components/section-title";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  const { isDirty } = form.formState;
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

      <div className="grid gap-4 md:grid-cols-12">
        <div className="dark space-y-5 rounded-lg border p-6 md:col-span-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
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
                        autoComplete="current-password"
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
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormDescription>At least 8 characters.</FormDescription>
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
                        autoComplete="new-password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                <Button type="submit" disabled={isPending} className="text-white">
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  {isPending ? "Updating..." : "Update password"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="dark space-y-5 rounded-lg border p-8 md:col-span-4">
          <h3 className="text-lg font-semibold">Security status</h3>
          {meQuery.isLoading ? (
            <Loader2 className="text-muted-foreground size-5 animate-spin" aria-label="Loading" />
          ) : meQuery.isError ? (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">Couldn&apos;t load account details.</p>
              <Button type="button" variant="outline" size="sm" onClick={() => meQuery.refetch()}>
                Try again
              </Button>
            </div>
          ) : passwordChangedAt ? (
            <p className="text-muted-foreground leading-relaxed">
              Your password was last changed on{" "}
              <span className="text-white">
                {format(new Date(passwordChangedAt), "dd/MM/yyyy 'at' hh:mm a")}
              </span>
              .
            </p>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your password has not been changed since the account was created.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
