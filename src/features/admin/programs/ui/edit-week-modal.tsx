"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { updateWeek } from "../actions/update-week.action";

interface EditWeekModalProps {
  week: {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWeekModal({ week, open, onOpenChange }: EditWeekModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: week.title,
    description: week.description,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateWeek(week.id, formData);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving week:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">
            Éditer la Semaine {week.weekNumber}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Titre</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de la semaine"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description de la semaine"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Annuler
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Sauvegarde...
              </>
            ) : (
              "Sauvegarder"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}