import Link from "next/link";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function AuthErrorPage({ params }: { params: Promise<{ error: string }> }) {
  const result = await params;

  return (
    <div className="flex h-full flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{result.error}</CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-2">
          <Link className={buttonVariants({ size: "small" })} href="/">
            Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
