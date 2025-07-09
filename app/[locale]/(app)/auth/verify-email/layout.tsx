import { ReactElement } from "react";
import { redirect } from "next/navigation";

import { getServerUrl } from "@/shared/lib/server-url";
import { paths } from "@/shared/constants/paths";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

interface RootLayoutProps {
  params: Promise<{ locale: string }>;
  children: ReactElement;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const auth = await serverRequiredUser();

  if (auth.emailVerified) {
    redirect(`${getServerUrl()}/${paths.root}`);
  }

  return children;
}
