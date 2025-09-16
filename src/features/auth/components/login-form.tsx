"use client";
import Button from "@/src/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { LoginFormSchema } from "@/src/definitions/login.definition";
import useLogin from "@/src/features/auth/api/use-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.input<typeof LoginFormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const { isPending } = loginMutation;
  const form = useForm<FormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = (values: FormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const redirectTo = searchParams.get("from") || "admin";
        router.push(redirectTo);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full md:w-150 px-4 md:px-0 flex flex-col gap-2"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type="password"
                  placeholder="password"
                  className="md:py-6"
                  autoComplete="current-password"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button as="button" disabled={isPending} className="rounded-md cursor">
          {isPending ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
}
