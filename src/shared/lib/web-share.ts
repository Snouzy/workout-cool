/**
 * Web Share API utilities
 * Simple and safe sharing functionality with fallbacks
 */

export interface ShareData {
  title: string;
  text?: string;
  url: string;
}

export type ShareResult = { success: true; method: "native" | "clipboard" } | { success: false; error: string };

/**
 * Check if native Web Share API is available
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator;
}

/**
 * Check if Clipboard API is available
 */
export function isClipboardSupported(): boolean {
  return typeof navigator !== "undefined" && "clipboard" in navigator;
}

/**
 * Share content using native Web Share API or fallback to clipboard
 */
export async function shareContent(data: ShareData): Promise<ShareResult> {
  // Validate required data
  if (!data.title || !data.url) {
    return { success: false, error: "Missing required share data" };
  }

  // Try native Web Share API first (mobile-friendly)
  if (isWebShareSupported()) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      });
      return { success: true, method: "native" };
    } catch (error) {
      // User cancelled or error occurred, try fallback
      console.warn("Web Share failed, trying clipboard fallback:", error);
    }
  }

  // Fallback to clipboard
  if (isClipboardSupported()) {
    try {
      const shareText = data.text ? `${data.title}\n\n${data.text}\n\n${data.url}` : `${data.title}\n\n${data.url}`;

      await navigator.clipboard.writeText(shareText);
      return { success: true, method: "clipboard" };
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return { success: false, error: "Failed to copy to clipboard" };
    }
  }

  // No sharing method available
  return { success: false, error: "Sharing not supported on this device" };
}

/**
 * Generate shareable URL for current page
 */
export function getCurrentPageUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.href;
}
