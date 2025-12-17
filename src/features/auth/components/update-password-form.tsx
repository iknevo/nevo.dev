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
import { PasswordUpdateSchema } from "@/src/definitions/auth-validations";
import { useUpdatePassword } from "@/src/features/auth/api/use-update-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormValues = z.input<typeof PasswordUpdateSchema>;
export default function UpdatePasswordForm() {
  const router = useRouter();
  const updateMutation = useUpdatePassword();
  const { isPending } = updateMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      passwordCurrent: "",
      password: "",
      passwordConfirm: ""
    }
  });
  const handleSubmit = (values: FormValues) => {
    updateMutation.mutate(values, {
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
          name="passwordCurrent"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex min-h-5 items-center justify-between">
                <FormLabel>Current Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type="password"
                  placeholder="current password"
                  className="md:py-6"
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
                <Input
                  {...field}
                  disabled={isPending}
                  type="password"
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
                <Input
                  {...field}
                  disabled={isPending}
                  type="password"
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
