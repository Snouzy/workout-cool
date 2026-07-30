"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useI18n } from "locales/client";

import { cn } from "@/shared/lib/utils";
import { trackingConsentAction } from "@/features/consent-banner/model/tracking-consent.action";
import { Button } from "@/components/ui/button";

export function ConsentBanner() {
  const t = useI18n();

  const [isOpen, setOpen] = useState(true);
  const trackingAction = useAction(trackingConsentAction, {
    onExecute: () => setOpen(false),
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background fixed bottom-2 left-2 z-50 flex w-[calc(100vw-16px)] max-w-[420px] flex-col space-y-4 rounded-lg border border-primary p-4 transition-all md:bottom-4 md:left-4",
        isOpen && "animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-full",
      )}
    >
      <div className="text-sm">{t("commons.consent_banner")}</div>
      <div className="flex justify-end space-x-2">
        <Button className="h-8 rounded-full opacity-50" onClick={() => trackingAction.execute(false)}>
          {t("commons.deny")}
        </Button>
        <Button className="h-8 rounded-full" onClick={() => trackingAction.execute(true)}>
          {t("commons.accept")}
        </Button>
      </div>
    </div>
  );
}
