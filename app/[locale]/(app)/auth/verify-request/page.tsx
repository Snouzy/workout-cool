import Image from "next/image";

import { SiteConfig } from "@/shared/config/site-config";
import { Typography } from "@/components/ui/typography";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VerifyRequestPageParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AuthVerifyRequestPage({ params: _p, searchParams: _s }: VerifyRequestPageParams) {
  return (
    <div className="h-full">
      <header className="flex items-center gap-2 px-4 pt-4">
        <Image alt="app icon" height={32} src={SiteConfig.appIcon} width={32} />
        <Typography variant="h2">{SiteConfig.title}</Typography>
      </header>
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Almost There!</CardTitle>
            <CardDescription>
              {
                "To complete the verification, head over to your email inbox. You'll find a magic link from us. Click on it, and you're all set!"
              }
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
