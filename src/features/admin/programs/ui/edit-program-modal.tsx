"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Trash2 } from "lucide-react";
import { ProgramLevel } from "@prisma/client";

import { useI18n } from "locales/client";
import { allEquipmentValues, getEquipmentTranslation } from "@/shared/lib/workout-session/equipments";

import { updateProgram } from "../actions/update-program.action";

interface EditProgramModalProps {
  program: {
    id: string;
    title: string;
    titleEn: string;
    titleEs: string;
    titlePt: string;
    titleRu: string;
    titleZhCn: string;
    description: string;
    descriptionEn: string;
    descriptionEs: string;
    descriptionPt: string;
    descriptionRu: string;
    descriptionZhCn: string;
    category: string;
    image: string;
    level: ProgramLevel;
    type: string;
    durationWeeks: number;
    sessionsPerWeek: number;
    sessionDurationMin: number;
    equipment: string[];
    isPremium: boolean;
    coaches: Array<{
      id: string;
      name: string;
      image: string;
      order: number;
    }>;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProgramModal({ program, open, onOpenChange }: EditProgramModalProps) {
  const router = useRouter();
  const t = useI18n();
  const [activeTab, setActiveTab] = useState("fr");
  const [formData, setFormData] = useState({
    title: program.title,
    titleEn: program.titleEn,
    titleEs: program.titleEs,
    titlePt: program.titlePt,
    titleRu: program.titleRu,
    titleZhCn: program.titleZhCn,
    description: program.description,
    descriptionEn: program.descriptionEn,
    descriptionEs: program.descriptionEs,
    descriptionPt: program.descriptionPt,
    descriptionRu: program.descriptionRu,
    descriptionZhCn: program.descriptionZhCn,
    category: program.category,
    image: program.image,
    level: program.level,
    type: program.type,
    durationWeeks: program.durationWeeks,
    sessionsPerWeek: program.sessionsPerWeek,
    sessionDurationMin: program.sessionDurationMin,
    equipment: program.equipment,
    isPremium: program.isPremium,
    coaches: program.coaches,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProgram(program.id, formData);
      setActiveTab("fr");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving program:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setActiveTab("fr");
    onOpenChange(false);
  };

  const handleEquipmentChange = (equipment: string) => {
    const newEquipment = formData.equipment.includes(equipment)
      ? formData.equipment.filter((e) => e !== equipment)
      : [...formData.equipment, equipment];
    setFormData({ ...formData, equipment: newEquipment });
  };

  const addCoach = () => {
    const newCoaches = [...formData.coaches, { id: `new-${Date.now()}`, name: "", image: "", order: formData.coaches.length }];
    setFormData({ ...formData, coaches: newCoaches });
  };

  const removeCoach = (index: number) => {
    const newCoaches = formData.coaches.filter((_, i) => i !== index);
    setFormData({ ...formData, coaches: newCoaches });
  };

  const updateCoach = (index: number, field: string, value: string) => {
    const newCoaches = [...formData.coaches];
    newCoaches[index] = { ...newCoaches[index], [field]: value };
    setFormData({ ...formData, coaches: newCoaches });
  };

  if (!open) return null;

  return (
    <div className="modal modal-open modal-middle !mt-0">
      <div className="modal-box max-w-4xl overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Éditer le programme</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Language Tabs */}
          <div className="tabs tabs-boxed">
            <button className={`tab ${activeTab === "fr" ? "tab-active" : ""}`} onClick={() => setActiveTab("fr")} type="button">
              🇫🇷 FR
            </button>
            <button className={`tab ${activeTab === "en" ? "tab-active" : ""}`} onClick={() => setActiveTab("en")} type="button">
              🇺🇸 EN
            </button>
            <button className={`tab ${activeTab === "es" ? "tab-active" : ""}`} onClick={() => setActiveTab("es")} type="button">
              🇪🇸 ES
            </button>
            <button className={`tab ${activeTab === "pt" ? "tab-active" : ""}`} onClick={() => setActiveTab("pt")} type="button">
              🇵🇹 PT
            </button>
            <button className={`tab ${activeTab === "ru" ? "tab-active" : ""}`} onClick={() => setActiveTab("ru")} type="button">
              🇷🇺 RU
            </button>
            <button className={`tab ${activeTab === "zh" ? "tab-active" : ""}`} onClick={() => setActiveTab("zh")} type="button">
              🇨🇳 ZH
            </button>
          </div>

          {/* French Fields */}
          {activeTab === "fr" && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Titre (Français)</span>
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
                  <span className="label-text">Description (Français)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  value={formData.description}
                />
              </div>
            </div>
          )}

          {/* English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Title (English)</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  type="text"
                  value={formData.titleEn}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Description (English)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  value={formData.descriptionEn}
                />
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {activeTab === "es" && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Título (Español)</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                  type="text"
                  value={formData.titleEs}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Descripción (Español)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                  value={formData.descriptionEs}
                />
              </div>
            </div>
          )}

          {/* Portuguese Fields */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Título (Português)</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                  type="text"
                  value={formData.titlePt}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Descrição (Português)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, descriptionPt: e.target.value })}
                  value={formData.descriptionPt}
                />
              </div>
            </div>
          )}

          {/* Russian Fields */}
          {activeTab === "ru" && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Название (Русский)</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                  type="text"
                  value={formData.titleRu}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Описание (Русский)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                  value={formData.descriptionRu}
                />
              </div>
            </div>
          )}

          {/* Chinese Fields */}
          {activeTab === "zh" && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">标题 (中文)</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, titleZhCn: e.target.value })}
                  type="text"
                  value={formData.titleZhCn}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">描述 (中文)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  disabled={isSaving}
                  onChange={(e) => setFormData({ ...formData, descriptionZhCn: e.target.value })}
                  value={formData.descriptionZhCn}
                />
              </div>
            </div>
          )}

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
                onChange={(e) => setFormData({ ...formData, type: e.target.value as string })}
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

          {/* Coachs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="label">
                <span className="label-text font-medium">Coachs du programme</span>
              </label>
              <button className="btn btn-sm btn-primary" disabled={isSaving} onClick={addCoach} type="button">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {formData.coaches.length === 0 ? (
                <p className="text-base-content/60 text-center py-8">Aucun coach ajouté. Cliquez sur &quot;Ajouter&quot; pour commencer.</p>
              ) : (
                formData.coaches.map((coach, index) => (
                  <div className="flex gap-4 items-end" key={index}>
                    <div className="flex-1 form-control">
                      <label className="label" htmlFor={`coach-name-${index}`}>
                        <span className="label-text">Nom</span>
                      </label>
                      <input
                        className="input input-bordered"
                        disabled={isSaving}
                        id={`coach-name-${index}`}
                        onChange={(e) => updateCoach(index, "name", e.target.value)}
                        placeholder="Nom du coach"
                        value={coach.name}
                      />
                    </div>
                    <div className="flex-1 form-control">
                      <label className="label" htmlFor={`coach-image-${index}`}>
                        <span className="label-text">URL de l&apos;image</span>
                      </label>
                      <input
                        className="input input-bordered"
                        disabled={isSaving}
                        id={`coach-image-${index}`}
                        onChange={(e) => updateCoach(index, "image", e.target.value)}
                        placeholder="https://..."
                        value={coach.image}
                      />
                    </div>
                    <button className="btn btn-outline btn-sm" disabled={isSaving} onClick={() => removeCoach(index)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" disabled={isSaving} onClick={handleClose}>
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
