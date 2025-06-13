"use client";
import { useSearchParams } from "next/navigation";

import { WorkoutStepper } from "@/features/workout-builder/ui/workout-stepper";

export default function WorkoutBuilderPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || undefined;
  return <WorkoutStepper sessionId={sessionId} />;
}
