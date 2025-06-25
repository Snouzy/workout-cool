"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";

import { useI18n } from "locales/client";
import { allEquipmentValues, getEquipmentTranslation } from "@/shared/lib/workout-session/equipments";

import { updateProgram } from "../actions/update-program.action";

interface EditProgramModalProps {
  program: {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    category: string;
    image: string;
    level: ProgramLevel;
    type: ExerciseAttributeValueEnum;
    durationWeeks: number;
    sessionsPerWeek: number;
    sessionDurationMin: number;
    equipment: ExerciseAttributeValueEnum[];
    isPremium: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProgramModal({ program, open, onOpenChange }: EditProgramModalProps) {
  const router = useRouter();
  const t = useI18n();
  const [formData, setFormData] = useState({
    title: program.title,
    titleEn: program.titleEn,
    description: program.description,
    descriptionEn: program.descriptionEn,
    category: program.category,
    image: program.image,
    level: program.level,
    type: program.type,
    durationWeeks: program.durationWeeks,
    sessionsPerWeek: program.sessionsPerWeek,
    sessionDurationMin: program.sessionDurationMin,
    equipment: program.equipment,
    isPremium: program.isPremium,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProgram(program.id, formData);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving program:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEquipmentChange = (equipment: ExerciseAttributeValueEnum) => {
    const newEquipment = formData.equipment.includes(equipment)
      ? formData.equipment.filter((e) => e !== equipment)
      : [...formData.equipment, equipment];
    setFormData({ ...formData, equipment: newEquipment });
  };

  if (!open) return null;

  return (
    <div className="modal modal-open modal-middle !mt-0">
      <div className="modal-box max-w-4xl overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Éditer le programme</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Titre (FR)</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                type="text"
                value={formData.title}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Titre (EN)</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                type="text"
                value={formData.titleEn}
              />
            </div>
          </div>

          {/* Descriptions courtes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Description (FR)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-24"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                value={formData.description}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description (EN)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-24"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                value={formData.descriptionEn}
              />
            </div>
          </div>

          {/* Image et emoji */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                type="url"
                value={formData.image}
              />
            </div>
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Catégorie</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                type="text"
                value={formData.category}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Niveau</span>
              </label>
              <select
                className="select select-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as ProgramLevel })}
                value={formData.level}
              >
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExerciseAttributeValueEnum })}
                value={formData.type}
              >
                <option value="BODYWEIGHT">Poids du corps</option>
                <option value="DUMBBELL">Haltères</option>
                <option value="BARBELL">Barre</option>
                <option value="KETTLEBELLS">Kettlebells</option>
                <option value="RESISTANCE_BAND">Élastiques</option>
              </select>
            </div>
          </div>

          {/* Paramètres du programme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Durée (semaines)</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                min={1}
                onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) || 0 })}
                type="number"
                value={formData.durationWeeks}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Séances/semaine</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                min={1}
                onChange={(e) => setFormData({ ...formData, sessionsPerWeek: parseInt(e.target.value) || 0 })}
                type="number"
                value={formData.sessionsPerWeek}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Durée séance (min)</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                min={1}
                onChange={(e) => setFormData({ ...formData, sessionDurationMin: parseInt(e.target.value) || 0 })}
                type="number"
                value={formData.sessionDurationMin}
              />
            </div>
          </div>

          {/* Équipement */}
          <div>
            <label className="label">
              <span className="label-text">Équipement requis</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allEquipmentValues.map((equipment) => {
                const translation = getEquipmentTranslation(equipment, t);
                return (
                  <label className="label cursor-pointer justify-start gap-2" key={equipment}>
                    <input
                      checked={formData.equipment.includes(equipment)}
                      className="checkbox checkbox-sm"
                      disabled={isSaving}
                      onChange={() => handleEquipmentChange(equipment)}
                      type="checkbox"
                    />
                    <span className="label-text text-sm">{translation.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Premium */}
          <div>
            <label className="label cursor-pointer justify-start gap-2">
              <input
                checked={formData.isPremium}
                className="checkbox"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                type="checkbox"
              />
              <span className="label-text">Programme Premium</span>
            </label>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" disabled={isSaving} onClick={() => onOpenChange(false)}>
            Annuler
          </button>
          <button className="btn btn-primary" disabled={isSaving} onClick={handleSave}>
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
