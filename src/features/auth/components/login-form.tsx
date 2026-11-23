"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Button from "@/src/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { InputPassword } from "@/src/components/ui/input-password";
import { LoginFormSchema } from "@/src/definitions/auth-validations";
import { useForgetPassword } from "@/src/features/auth/api/use-forget-password";
import { useLogin } from "@/src/features/auth/api/use-login";
import { getSafeAdminRedirect } from "@/src/lib/safe-redirect";

type FormValues = z.input<typeof LoginFormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const forgotPasswordMutation = useForgetPassword();
  const isLoggingIn = loginMutation.isPending || loginMutation.isSuccess;
  const isBusy = isLoggingIn || forgotPasswordMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch {
      return;
    }
    router.replace(getSafeAdminRedirect(searchParams.get("from")));
  };

  const handleForget = async () => {
    const isValid = await form.trigger("email");
    if (!isValid) {
      form.setFocus("email");
      return;
    }
    forgotPasswordMutation.mutate(
      { email: form.getValues("email") },
      { onSuccess: ({ message }) => toast.success(message) }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-2 space-y-4 px-4 md:w-150 md:px-0"
        noValidate
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex min-h-5 items-center justify-between">
                <FormLabel>Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  {...field}
                  className="md:py-6"
                  disabled={isBusy}
                  placeholder="example@gmail.com"
                  autoComplete="email"
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
                  disabled={isBusy}
                  placeholder="password"
                  className="md:py-6"
                  autoComplete="current-password"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <button
          onClick={handleForget}
          type="button"
          disabled={isBusy}
          className="text-primary inline-flex items-center gap-2 self-end font-semibold disabled:opacity-50"
        >
          {forgotPasswordMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Forgot Password?
        </button>
        <Button
          as="button"
          disabled={isBusy}
          className="cursor rounded-md text-white hover:text-black"
        >
          {isLoggingIn ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
}
