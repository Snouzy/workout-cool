"use client";

import { useI18n } from "locales/client";
import { ProviderButton } from "@/features/auth/ui/ProviderButton";
import { useSignUp } from "@/features/auth/signup/model/useSignUp";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signUpSchema } from "../schema/signup.schema";

import type { SignUpSchema } from "../schema/signup.schema";

export const SignUpForm = () => {
  const t = useI18n();

  const form = useZodForm({ schema: signUpSchema });

  const { signUp } = useSignUp();

  async function onSubmit(values: SignUpSchema) {
    if (values.password !== values.verifyPassword) {
      form.setError("verifyPassword", {
        message: "Password does not match",
      });
      return;
    }

    return signUp(values);
  }

  return (
    <>
      <Form
        className="max-w-lg space-y-4"
        form={form}
        onSubmit={async (values) => {
          return onSubmit(values);
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("commons.first_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("commons.last_name")}</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("commons.email")}</FormLabel>
              <FormControl>
                <Input placeholder="john@doe.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("commons.password")}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="verifyPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("commons.verify_password")}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" size="large" type="submit">
          {t("commons.submit")}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">{t("commons.or")}</span>
          </div>
        </div>
      </Form>
      <div className="mt-2 flex flex-col gap-2">
        <ProviderButton action="signup" providerId="google" variant="default" />
      </div>
    </>
  );
};
