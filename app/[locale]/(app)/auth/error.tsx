"use client";

import { useEffect } from "react";

import { logger } from "@/shared/lib/logger";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { ErrorParams } from "@/shared/types/next";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sorry, something went wrong. Please try again later.</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button onClick={reset}>Try again</Button>
      </CardFooter>
    </Card>
  );
}
