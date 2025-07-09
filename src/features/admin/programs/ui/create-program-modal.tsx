"use client";

import { useState } from "react";
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
    <>
      {open && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl h-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Créer un nouveau programme</h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={handleClose}
              >
                ✕
              </button>
            </div>
            
            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-6 px-4">
              {STEPS.map((step, index) => (
                <div className="flex items-center" key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        completedSteps.includes(step.id)
                          ? "bg-success border-success text-white"
                          : currentStep === step.id
                          ? "bg-primary border-primary text-white"
                          : "border-base-300 text-base-content/50"
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
                      <div className="text-xs text-base-content/60">{step.description}</div>
                    </div>
                  </div>
                  
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-20 h-0.5 mx-4 ${
                        completedSteps.includes(step.id) ? "bg-success" : "bg-base-300"
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
                onCancel={handleClose}
                onStepComplete={handleStepComplete}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}