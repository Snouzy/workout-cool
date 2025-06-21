"use client";

import { useEffect, useRef } from "react";

import { useChangeLocale, useCurrentLocale } from "locales/client";
import { useUpdateUserLocale } from "@/entities/user/model/update-user-locale";

export function useAutoLocale() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const updateUserLocale = useUpdateUserLocale();
  const hasAutoDetected = useRef(false);

  useEffect(() => {
    // Only run auto-detection once on mount
    if (hasAutoDetected.current) return;

    const detectedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("detected-locale="))
      ?.split("=")[1];

    // Only change if we have a detected locale different from current
    if (detectedLocale && detectedLocale !== currentLocale) {
      hasAutoDetected.current = true;

      // Change locale on client
      changeLocale(detectedLocale as any);

      // Save to database silently
      updateUserLocale.mutate({ locale: detectedLocale });
    }
  }, []); // Remove dependencies to run only once
}
