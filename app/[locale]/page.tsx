import React from "react";

import { getI18n } from "locales/server";
import { WorkoutStepper } from "@/features/workout-builder";
import { serverAuth } from "@/entities/user/model/get-server-session-user";

export default async function HomePage() {
  const user = await serverAuth();
  const t = await getI18n();

  return (
    <div className="bg-background text-foreground relative flex h-fit flex-col">
      <WorkoutStepper />
    </div>
  );
}
