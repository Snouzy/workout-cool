import type { ReactNode } from "react";

import { Header } from "@/features/layout/Header";
import { Footer } from "@/features/layout/Footer";
import { BottomNavigation } from "@/features/layout/BottomNavigation";

interface RootLayoutProps {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="mx-auto card w-full max-w-3xl min-h-[500px] max-h-[90vh] bg-white dark:bg-[#232324] shadow-xl border border-base-200 dark:border-slate-700 flex flex-col justify-between overflow-hidden max-sm:rounded-none max-sm:h-full rounded-lg">
      <Header />
      {/* TODO: remove min-h-0 if something is broken */}
      <div className="flex-1 overflow-auto flex flex-col min-h-0">{children}</div>
      <BottomNavigation />
      <Footer />
    </div>
  );
}
