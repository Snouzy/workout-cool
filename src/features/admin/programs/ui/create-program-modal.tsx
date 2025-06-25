"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { CreateProgramForm } from "./create-program-form";

interface CreateProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { id: 1, title: "Informations générales", description: "Titre, description, niveau..." },
  { id: 2, title: "Configuration", description: "Durée, fréquence, équipement..." },
  { id: 3, title: "Coachs", description: "Ajouter les coachs du programme" },
] as const;

export function CreateProgramModal({ open, onOpenChange }: CreateProgramModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    
    // Move to next step if not last
    if (step < STEPS.length) {
      setCurrentStep(step + 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    onOpenChange(false);
  };

  const handleSuccess = () => {
    handleClose();
    // Refresh the page to show the new program
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Créer un nouveau programme</DialogTitle>
        </DialogHeader>
        
        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-6 px-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    completedSteps.includes(step.id)
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
              
              {index < STEPS.length - 1 && (
                <div
                  className={`w-20 h-0.5 mx-4 ${
                    completedSteps.includes(step.id) ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto">
          <CreateProgramForm
            currentStep={currentStep}
            onStepComplete={handleStepComplete}
            onSuccess={handleSuccess}
            onCancel={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}