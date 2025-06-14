"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "locales/client";
import { Input } from "@/fitlinks/components/ui/input";
import { Button } from "@/fitlinks/components/ui/button";
import { updatePasswordAction } from "@/features/settings/update-password/model/update-password.action";
import { brandedToast } from "@/components/ui/toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordForm() {
  const t = useI18n();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: PasswordFormValues) => {
    try {
      const result = await updatePasswordAction(values);

      if (result?.serverError) {
        brandedToast({ title: t(result?.serverError as keyof typeof t), variant: "error" });
        return;
      }

      brandedToast({ title: t("password_updated_successfully"), variant: "success" });
      form.reset();
    } catch (error) {
      brandedToast({ title: t("generic_error"), variant: "error" });
      console.error(error);
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <div className="space-y-5 p-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className="space-y-2.5">
              <FormLabel className="font-semibold leading-tight">{t("current_password")}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input {...field} className="ltr:pl-9 rtl:pr-9" placeholder={t("current_password_placeholder")} type="password" />
                </FormControl>
                <LockKeyhole className="absolute top-3 size-4 ltr:left-3 rtl:right-3" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="space-y-2.5">
              <FormLabel className="font-semibold leading-tight">{t("new_password")}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input {...field} className="ltr:pl-9 rtl:pr-9" placeholder={t("new_password_placeholder")} type="password" />
                </FormControl>
                <LockKeyholeOpen className="absolute top-3 size-4 ltr:left-3 rtl:right-3" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2.5">
              <FormLabel className="font-semibold leading-tight">{t("confirm_password")}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input {...field} className="ltr:pl-9 rtl:pr-9" placeholder={t("confirm_password_placeholder")} type="password" />
                </FormControl>
                <LockKeyholeOpen className="absolute top-3 size-4 ltr:left-3 rtl:right-3" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-4">
          <Button className="text-danger" onClick={() => form.reset()} size="large" type="button" variant="outline-general">
            Cancel
          </Button>
          <Button disabled={form.formState.isSubmitting} size="large" type="submit" variant="black">
            {form.formState.isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
