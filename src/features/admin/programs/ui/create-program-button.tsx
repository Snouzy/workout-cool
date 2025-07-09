"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CreateProgramModal } from "./create-program-modal";

export function CreateProgramButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="btn btn-primary"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Créer un programme
      </button>
      
      <CreateProgramModal
        onOpenChange={setIsModalOpen}
        open={isModalOpen}
      />
    </>
  );
}