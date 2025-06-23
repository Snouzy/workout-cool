"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { I18nProviderClient } from "locales/client";
import { AnalyticsProvider } from "@/shared/lib/analytics/client";
import { DialogRenderer } from "@/features/dialogs-provider/DialogProvider";
import { useAutoLocale } from "@/entities/user/model/use-auto-locale";
import { ToastSonner } from "@/components/ui/ToastSonner";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";

import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

function LocaleDetector() {
  useAutoLocale();
  return null;
}

export const Providers = ({ children, locale }: PropsWithChildren<{ locale: string }>) => {
  return (
    <>
      <AnalyticsProvider />
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <I18nProviderClient locale={locale}>
            <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
              <LocaleDetector />
              <Toaster />
              <ToastSonner />
              <DialogRenderer />
              <ReactQueryDevtools initialIsOpen={false} />
              {children}
            </ThemeProvider>
          </I18nProviderClient>
        </QueryClientProvider>
      </NuqsAdapter>
    </>
  );
};
