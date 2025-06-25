"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProgramModal } from "./create-program-modal";

export function CreateProgramButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Créer un programme
      </Button>
      
      <CreateProgramModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}