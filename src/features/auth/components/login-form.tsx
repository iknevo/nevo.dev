"use client";

import Button from "@/src/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { InputPassword } from "@/src/components/ui/input-password";
import { LoginFormSchema } from "@/src/definitions/auth-validations";
import { useForgetPassword } from "@/src/features/auth/api/use-forget-password";
import { useLogin } from "@/src/features/auth/api/use-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormValues = z.input<typeof LoginFormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const forgotPasswordMutation = useForgetPassword();
  const { isPending } = loginMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const handleSubmit = (values: FormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const redirectTo = searchParams.get("from") || "/admin";
        router.push(redirectTo);
      }
    });
  };
  const handleForget = async () => {
    const isValid = await form.trigger("email");
    if (!isValid) {
      return;
    }
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", {});
      return;
    }
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        }
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-2 space-y-4 px-4 md:w-150 md:px-0"
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
                  disabled={isPending}
                  placeholder="example@gmail.com"
                  autoComplete="on"
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
          className="text-primary self-end font-semibold"
        >
          Forgot Password?
        </button>
        <Button as="button" disabled={isPending} className="cursor rounded-md">
          {isPending ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
}
