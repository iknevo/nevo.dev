"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { PasswordResetSchema } from "@/src/definitions/auth-validations";
import { useResetPassword } from "@/src/features/auth/api/use-reset-password";
import { ApiError } from "@/src/lib/api-error";

import AuthCard from "./auth-card";

type FormValues = z.input<typeof PasswordResetSchema>;
type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const resetMutation = useResetPassword(token);
  const isBusy = resetMutation.isPending || resetMutation.isSuccess;
  const linkExpired = resetMutation.error instanceof ApiError && resetMutation.error.status === 410;

  const form = useForm<FormValues>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const { message } = await resetMutation.mutateAsync(values);
      toast.success(message);
      router.replace("/admin");
    } catch {}
  };

  if (linkExpired) {
    return (
      <AuthCard title="Link expired" description={resetMutation.error?.message}>
        <Button asChild size="lg" className="w-full text-white">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set a new password" description="Choose a new password for your account.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6" noValidate>
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={isBusy}
                    placeholder="New password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormDescription>At least 8 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="passwordConfirm"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={isBusy}
                    placeholder="Repeat the new password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {resetMutation.isError && (
            <p className="text-destructive text-sm" role="alert">
              {resetMutation.error.message}
            </p>
          )}
          <Button type="submit" size="lg" disabled={isBusy} className="w-full text-white">
            {isBusy && <Loader2 className="animate-spin" />}
            {isBusy ? "Saving..." : "Save new password"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
