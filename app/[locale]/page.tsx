import React from "react";

import { WorkoutStepper } from "@/features/workout-builder";

export default async function HomePage() {
  // const user = await serverAuth();
  // const t = await getI18n();

  return (
    <div className="bg-background text-foreground relative flex h-fit flex-col">
      <WorkoutStepper />
    </div>
  );
}
