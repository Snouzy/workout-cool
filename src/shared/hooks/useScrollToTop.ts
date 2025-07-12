import { useCallback } from "react";

/**
 * Custom hook to handle scroll to top in a robust way
 * Handles cases where window.scrollTo doesn't work or isn't available
 * Takes into account containers with overflow-auto
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    try {
      // Check if window is available (SSR safety)
      if (typeof window === "undefined") {
        console.warn("Window is not available - likely running on server");
        return;
      }

      // First look for a scrollable container with overflow-auto
      const scrollableContainers = document.querySelectorAll(".overflow-auto, [class*='overflow-auto']");

      if (scrollableContainers.length > 0) {
        // Go through all scrollable containers and scroll them to the top
        scrollableContainers.forEach((container) => {
          if (container instanceof HTMLElement) {
            container.scrollTo({ top: 0, behavior: "smooth" });
          }
        });

        // Also try to scroll the main container that might have flex-1 overflow-auto
        const mainContainer = document.querySelector(".flex-1.overflow-auto");
        if (mainContainer instanceof HTMLElement) {
          mainContainer.scrollTo({ top: 0, behavior: "smooth" });
        }

        return;
      }

      // If no scrollable container found, use classic methods
      // Try window.scrollTo first (modern method)
      if (window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Fallback 1: use scrollTop on documentElement
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }

      // Fallback 2: use scrollTop on body
      if (document.body) {
        document.body.scrollTop = 0;
      }
    } catch (error) {
      console.error("Error scrolling to top:", error);

      // Emergency fallback: try to find any scrollable element
      try {
        const allElements = document.querySelectorAll("*");
        allElements.forEach((element) => {
          if (element instanceof HTMLElement && element.scrollTop > 0) {
            element.scrollTop = 0;
          }
        });
      } catch (fallbackError) {
        console.error("Fallback scroll failed:", fallbackError);
      }
    }
  }, []);

  return scrollToTop;
}
