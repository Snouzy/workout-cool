import { ReactElement } from "react";

interface RootLayoutProps {
    params: Promise<{ locale: string }>;
    children: ReactElement;
  }

export default async function RootLayout({ children }: RootLayoutProps) {

    return (
        <div>
            {children}
        </div>
    )
}