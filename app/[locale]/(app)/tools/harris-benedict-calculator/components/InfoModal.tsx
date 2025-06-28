"use client";

import React, { useEffect } from "react";
import { XIcon } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function InfoModal({ isOpen, onClose, title, content }: InfoModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto animate-fadeIn">
        <div className="bg-base-100 dark:bg-base-200 rounded-2xl shadow-2xl border border-base-content/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-base-content dark:text-base-content/90 pr-4">{title}</h3>
            <button
              aria-label="Close modal"
              className="p-1 rounded-lg hover:bg-base-200 dark:hover:bg-base-300/50 transition-colors"
              onClick={onClose}
            >
              <XIcon className="w-5 h-5 text-base-content/60" />
            </button>
          </div>
          <p className="text-sm text-base-content/70 dark:text-base-content/60 leading-relaxed">{content}</p>
        </div>
      </div>
    </>
  );
}
