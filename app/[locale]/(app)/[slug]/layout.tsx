import type { ReactNode } from "react";

interface RootLayoutProps {
    params: Promise<{ locale: string }>;
    children: ReactNode;
  }

export default async function RootLayout({ children }: RootLayoutProps) {

    return (
        <div>
            {children}
        </div>
    )
}