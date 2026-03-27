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
    <div className="mx-auto card w-full max-w-3xl min-h-[500px] max-sm:min-h-screen bg-white dark:bg-[#232324] shadow-xl border border-base-200 dark:border-slate-700 flex flex-col max-sm:rounded-none rounded-lg">
      <Header />
      <div className="flex-1 flex flex-col max-sm:pb-16">{children}</div>
      <BottomNavigation />
      <Footer />
    </div>
  );
}
