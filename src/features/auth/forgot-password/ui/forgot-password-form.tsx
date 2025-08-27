"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "locales/client";
import { paths } from "@/shared/constants/paths";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/features/auth/forgot-password/forgot-password.schema";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useForgotPassword } from "../model/useForgotPassword";

export const ForgotPasswordForm = () => {
  const t = useI18n();
  const { forgotPassword, isLoading, isEmailSent } = useForgotPassword();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    await forgotPassword(data.email, (msg) => {
      form.setError("email", {
        type: "manual",
        message: msg,
      });
    });
  };

  if (isEmailSent) {
    return (
      <Alert className="w-full h-full" variant="success">
        <AlertDescription>{t("success.password_forgot_success")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("password_forgot_title")}</h1>
        <p className="text-muted-foreground text-sm">{t("password_forgot_subtitle")}</p>
      </div>

      <Form form={form} onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input autoComplete="email" placeholder="nom@exemple.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-6 w-full" disabled={isLoading} size="large" type="submit">
          {isLoading ? t("commons.sending") : t("commons.send_me_link")}
        </Button>
      </Form>

      <div className="text-center text-sm">
        <Link className="text-primary hover:underline" href={`/${paths.signIn}`}>
          {t("commons.back_to_login")}
        </Link>
      </div>
    </div>
  );
};
