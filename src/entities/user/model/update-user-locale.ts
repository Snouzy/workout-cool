"use client";

import { useMutation } from "@tanstack/react-query";

import { useCurrentUser } from "@/entities/user/model/useCurrentUser";
import { updateUserAction } from "@/entities/user/model/update-user.action";

interface UpdateUserLocaleParams {
  locale: string;
}

export function useUpdateUserLocale() {
  const user = useCurrentUser();

  return useMutation({
    mutationFn: async ({ locale }: UpdateUserLocaleParams) => {
      if (!user) {
        return;
      }

      const result = await updateUserAction({ locale });

      if (!result?.data?.success) {
        throw new Error("Failed to update user locale");
      }

      return result.data;
    },
    onError: (error) => {
      console.error("Failed to update user locale:", error);
      // silent fail, ux friendly
    },
  });
}
