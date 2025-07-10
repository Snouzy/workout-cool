"use client";

import React from "react";

import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

interface ScrollToTopButtonProps {
  text: string;
}

export function ScrollToTopButton({ text }: ScrollToTopButtonProps) {
  const scrollToTop = useScrollToTop();

  return (
    <button
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl font-bold py-6 px-12 rounded-full transform transition-all hover:scale-105 active:scale-95 shadow-xl"
      onClick={scrollToTop}
    >
      {text}
    </button>
  );
}
