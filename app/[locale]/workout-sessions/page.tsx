"use client";
import { useRouter } from "next/navigation";

import { WorkoutSessionList } from "@/features/workout-session/ui/workout-session-list";
import { Button } from "@/components/ui/button";

export default function WorkoutSessionsPage() {
  const router = useRouter();

  return (
    <div className="">
      <WorkoutSessionList onSelect={(id) => router.push(`/workout-builder?sessionId=${id}`)} />
      <div className="mt-8 flex justify-center">
        <Button onClick={() => router.push("/workout-builder")} size="large">
          Nouvelle séance
        </Button>
      </div>
    </div>
  );
}
