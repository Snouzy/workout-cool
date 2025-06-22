"use client";

import { useMutation } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { SignUpSchema } from "@/features/auth/signup/schema/signup.schema";
import { signUpAction } from "@/features/auth/signup/model/signup.action";
import { brandedToast } from "@/components/ui/toast";

export const useSignUp = () => {
  const t = useI18n();

  const mutation = useMutation({
    mutationFn: async (values: SignUpSchema) => {
      if (values.password !== values.verifyPassword) {
        throw new Error("PASSWORD_MISMATCH");
      }

      const result = await signUpAction(values);

      if (result?.serverError) {
        throw new Error(result.serverError);
      }

      return result;
    },

    onSuccess: async () => {
      window.location.href = "/profile";
      // router.push(`/${paths.verifyEmail}?signin=true`);
    },

    onError: (error: unknown) => {
      const message = error instanceof Error ? t(error.message as keyof typeof t) : t("error.generic_error");

      brandedToast({ title: message, variant: "error" });
    },
  });

  return {
    signUp: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
