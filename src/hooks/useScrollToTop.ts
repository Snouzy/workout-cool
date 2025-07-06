import { useCallback } from "react";

/**
 * Hook personnalisé pour gérer le scroll vers le haut de manière robuste
 * Gère les cas où window.scrollTo ne fonctionne pas ou n'est pas disponible
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    try {
      // Vérifier si window est disponible (SSR safety)
      if (typeof window === "undefined") {
        console.warn("Window is not available - likely running on server");
        return;
      }

      // Essayer window.scrollTo d'abord (méthode moderne)
      if (window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Fallback 1: utiliser scrollTop sur documentElement
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }

      // Fallback 2: utiliser scrollTop sur body
      if (document.body) {
        document.body.scrollTop = 0;
      }
    } catch (error) {
      console.error("Error scrolling to top:", error);

      // Fallback d'urgence: utiliser hash
      try {
        window.location.hash = "#top";
        // Retirer le hash après un délai pour éviter de le voir dans l'URL
        setTimeout(() => {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        }, 100);
      } catch (hashError) {
        console.error("Hash fallback failed:", hashError);
      }
    }
  }, []);

  return scrollToTop;
}
