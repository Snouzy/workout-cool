"use client";

import { useCallback } from "react";

const PENDING_CHECKOUT_KEY = "pendingCheckout";

interface PendingCheckout {
  planId: string;
  timestamp: number;
}

export function usePendingCheckout() {
  const storePendingCheckout = useCallback((planId: string) => {
    if (typeof window === "undefined") return;
    
    const pendingCheckout: PendingCheckout = {
      planId,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pendingCheckout));
  }, []);

  const getPendingCheckout = useCallback((): PendingCheckout | null => {
    if (typeof window === "undefined") return null;
    
    const stored = localStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!stored) return null;
    
    try {
      const parsed = JSON.parse(stored) as PendingCheckout;
      
      // Check if it's not too old (1 hour max)
      const isExpired = Date.now() - parsed.timestamp > 60 * 60 * 1000;
      if (isExpired) {
        localStorage.removeItem(PENDING_CHECKOUT_KEY);
        return null;
      }
      
      return parsed;
    } catch {
      localStorage.removeItem(PENDING_CHECKOUT_KEY);
      return null;
    }
  }, []);

  const clearPendingCheckout = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PENDING_CHECKOUT_KEY);
  }, []);

  return {
    storePendingCheckout,
    getPendingCheckout,
    clearPendingCheckout,
  };
}