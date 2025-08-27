"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetPasswordFormData, resetPasswordSchema } from "@/features/auth/reset-password/schema/reset-password.schema";
import { useResetPassword } from "@/features/auth/reset-password/model/useResetPassword";
import { InputPasswordStrength } from "@/components/ui/input-password-strength";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ResetPasswordForm() {
  const { isLoading, hasToken, resetPassword } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData: ResetPasswordFormData) => {
    await resetPassword(formData.password);
  };

  if (!hasToken) {
    return (
      <Alert variant="error">
        <AlertDescription>Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Réinitialisation du mot de passe</h1>
        <p className="text-muted-foreground text-sm">Veuillez choisir un nouveau mot de passe</p>
      </div>

      <Form form={form} onSubmit={onSubmit}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nouveau mot de passe</FormLabel>
                <FormControl>
                  <InputPasswordStrength {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input autoComplete="new-password" placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="mt-6 w-full" disabled={isLoading} type="submit">
          {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
        </Button>
      </Form>
    </div>
  );
}
