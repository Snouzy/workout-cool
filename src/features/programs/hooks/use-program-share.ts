"use client";

import { useState } from "react";

import { useI18n } from "locales/client";
import { shareContent, getCurrentPageUrl, type ShareData, type ShareResult } from "@/shared/lib/web-share";

interface UseProgramShareProps {
  programTitle: string;
  programDescription?: string;
}

/**
 * Hook for sharing program content
 * Handles sharing logic and user feedback
 */
export function useProgramShare({ programTitle }: UseProgramShareProps) {
  const t = useI18n();
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  /**
   * Share the current program page
   */
  const handleShare = async (): Promise<void> => {
    setIsSharing(true);
    setShareMessage(null);

    try {
      const shareData: ShareData = {
        title: t("programs.check_out_program"),
        text: programTitle,
        url: getCurrentPageUrl(),
      };

      const result: ShareResult = await shareContent(shareData);

      if (result.success) {
        const message = result.method === "native" ? t("programs.share_success") : t("programs.copied_to_clipboard");

        setShareMessage(message);

        // Clear message after 3 seconds
        setTimeout(() => setShareMessage(null), 3000);
      } else {
        setShareMessage(t("programs.share_failed"));
        console.error("Share failed:", result.error);
      }
    } catch (error) {
      setShareMessage(t("programs.share_failed"));
      console.error("Unexpected share error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return {
    handleShare,
    isSharing,
    shareMessage,
  };
}
