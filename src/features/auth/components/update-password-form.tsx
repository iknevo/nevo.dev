"use client";
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
import { PasswordUpdateSchema } from "@/src/definitions/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useUpdatePassword from "../api/use-update-password";

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
      passwordConfirm: "",
    },
  });
  const handleSubmit = (values: FormValues) => {
    updateMutation.mutate(values, {
      onSuccess: ({ message }) => {
        toast.success(message);
        router.push("/admin");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full md:w-150 px-4 md:px-0 flex flex-col gap-2 space-y-4"
      >
        <FormField
          name="passwordCurrent"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between min-h-5">
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
              <div className="flex items-center justify-between min-h-5">
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
              <div className="flex items-center justify-between min-h-5">
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
        <Button as="button" disabled={isPending} className="rounded-md cursor">
          {isPending ? <Loader2 className="animate-spin" /> : "Update Password"}
        </Button>
      </form>
    </Form>
  );
}
