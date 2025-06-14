"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { event } from "@/shared/lib/facebook/fb-pixel";
import { LogEvents } from "@/shared/lib/analytics/events";
import { paths } from "@/shared/constants/paths";
import { SignUpSchema } from "@/features/auth/signup/schema/signup.schema";
import { signUpAction } from "@/features/auth/signup/model/signup.action";
import { brandedToast } from "@/components/ui/toast";

export const useSignUp = () => {
  const t = useI18n();
  const router = useRouter();

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

    onSuccess: (res) => {
      router.push(`/${paths.verifyEmail}`);

      event(LogEvents.Registered.facebookNativeName, {
        email: res?.data?.user.email || "",
      });
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
