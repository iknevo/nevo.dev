"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  FormMessage
} from "@/src/components/ui/form";
import { InputPassword } from "@/src/components/ui/input-password";
import { PasswordResetSchema } from "@/src/definitions/auth-validations";
import { useResetPassword } from "@/src/features/auth/api/use-reset-password";

type FormValues = z.input<typeof PasswordResetSchema>;
type Props = {
  token: string;
};
export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const resetMutation = useResetPassword(token);
  const { isPending } = resetMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: "",
      passwordConfirm: ""
    }
  });
  const handleSubmit = (values: FormValues) => {
    resetMutation.mutate(values, {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.push("/admin");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-2 space-y-4 px-4 md:w-150 md:px-0"
      >
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
                  className="md:py-6"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button as="button" disabled={isPending} className="cursor rounded-md">
          {isPending ? <Loader2 className="animate-spin" /> : "Update Password"}
        </Button>
      </form>
    </Form>
  );
}
