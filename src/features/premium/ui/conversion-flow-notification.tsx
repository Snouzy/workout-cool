"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { useI18n } from "locales/client";
import { usePendingCheckout } from "@/shared/lib/premium/use-pending-checkout";

export function ConversionFlowNotification() {
  const t = useI18n();
  const { getPendingCheckout } = usePendingCheckout();
  const [showNotification, setShowNotification] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);

  useEffect(() => {
    const pendingCheckout = getPendingCheckout();
    if (pendingCheckout) {
      setPlanId(pendingCheckout.planId);
      setShowNotification(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [getPendingCheckout]);

  if (!showNotification || !planId) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-200 dark:border-green-800 p-4">
        <div className="flex items-start gap-3">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm">{t("commons.loading")}</h3>
          <Loader2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
