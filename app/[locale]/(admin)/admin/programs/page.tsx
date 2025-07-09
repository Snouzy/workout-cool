import { Suspense } from "react";

import { ProgramsList } from "@/features/admin/programs/ui/programs-list";
import { CreateProgramButton } from "@/features/admin/programs/ui/create-program-button";

export default function AdminPrograms() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground">Create, edit, view and delete programs.</p>
        </div>
        <CreateProgramButton />
      </div>

      <Suspense fallback={<div>Loading programs...</div>}>
        <ProgramsList />
      </Suspense>
    </div>
  );
}
