"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useI18n } from "locales/client";
import { paths } from "@/shared/constants/paths";
import { authClient } from "@/features/auth/lib/auth-client";
import { brandedToast } from "@/components/ui/toast";
interface UseResetPasswordResult {
  isLoading: boolean;
  hasToken: boolean;
  resetPassword: (password: string) => Promise<void>;
}

export const useResetPassword = (): UseResetPasswordResult => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token") ?? "";

  const hasToken = Boolean(token);

  const resetPassword = async (password: string) => {
    if (!hasToken) return;

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({ token, newPassword: password });

      if (error) {
        brandedToast({ title: t("error.generic_error"), variant: "error" });
        return;
      }

      brandedToast({ title: t("success.reset_password_success"), variant: "success" });
      router.push(`/${paths.signIn}?reset=success`);
    } catch (e) {
      console.error(e);
      brandedToast({ title: t("error.generic_error"), variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, hasToken, resetPassword };
};
