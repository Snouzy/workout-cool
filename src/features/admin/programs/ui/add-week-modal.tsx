"use client";

import { z } from "zod";
import { useState } from "react";
import { X } from "lucide-react";

import { addWeekToProgram } from "../actions/add-week.action";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const weekSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  titleEn: z.string().min(1, "Le titre en anglais est requis"),
  titleEs: z.string().min(1, "Le titre en espagnol est requis"),
  titlePt: z.string().min(1, "Le titre en portugais est requis"),
  titleRu: z.string().min(1, "Le titre en russe est requis"),
  titleZhCn: z.string().min(1, "Le titre en chinois est requis"),
  titleZhTw: z.string().min(1, "Le titre en chinois traditionnel est requis"),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  descriptionPt: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionZhCn: z.string().optional(),
  descriptionZhTw: z.string().optional(),
});

type WeekFormData = z.infer<typeof weekSchema>;

interface AddWeekModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string;
  nextWeekNumber: number;
}

export function AddWeekModal({ open, onOpenChange, programId, nextWeekNumber }: AddWeekModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("fr");
  const [formData, setFormData] = useState<WeekFormData>({
    title: `Semaine ${nextWeekNumber}`,
    titleEn: `Week ${nextWeekNumber}`,
    titleEs: `Semana ${nextWeekNumber}`,
    titlePt: `Semana ${nextWeekNumber}`,
    titleRu: `Неделя ${nextWeekNumber}`,
    titleZhCn: `第${nextWeekNumber}周`,
    titleZhTw: `第 ${nextWeekNumber} 週`,
    description: "",
    descriptionEn: "",
    descriptionEs: "",
    descriptionPt: "",
    descriptionRu: "",
    descriptionZhCn: "",
    descriptionZhTw: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addWeekToProgram({
        programId,
        weekNumber: nextWeekNumber,
        ...formData,
      });

      onOpenChange(false);
      window.location.reload(); // Refresh to show new week
    } catch (error) {
      console.error("Error adding week:", error);
      alert("Erreur lors de l'ajout de la semaine");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setActiveTab("fr");
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="modal modal-open modal-middle !mt-0">
      <div className="modal-box max-w-4xl overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Ajouter une semaine</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
              <button className={`tab ${activeTab === "zh-TW" ? "tab-active" : ""}`} onClick={() => setActiveTab("zh-TW")} type="button">
                🇹🇼 zh-TW
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={`Semaine ${nextWeekNumber}`}
                    required
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de cette semaine..."
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder={`Week ${nextWeekNumber}`}
                    required
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Week description..."
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                    placeholder={`Semana ${nextWeekNumber}`}
                    required
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                    placeholder="Descripción de la semana..."
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                    placeholder={`Semana ${nextWeekNumber}`}
                    required
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionPt: e.target.value })}
                    placeholder="Descrição da semana..."
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                    placeholder={`Неделя ${nextWeekNumber}`}
                    required
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                    placeholder="Описание недели..."
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleZhCn: e.target.value })}
                    placeholder={`第${nextWeekNumber}周`}
                    required
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
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionZhCn: e.target.value })}
                    placeholder="本周描述..."
                    value={formData.descriptionZhCn}
                  />
                </div>
              </div>
            )}

            {/* Traditional Chinese Fields */}
            {activeTab === "zh-TW" && (
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">標題（繁體中文）</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleZhTw: e.target.value })}
                    placeholder={`第 ${nextWeekNumber} 週`}
                    required
                    type="text"
                    value={formData.titleZhTw}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">說明（繁體中文）</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionZhTw: e.target.value })}
                    placeholder="本週說明..."
                    value={formData.descriptionZhTw}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" disabled={isLoading} onClick={handleClose} type="button">
              Annuler
            </button>
            <button className="btn btn-primary" disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Ajout...
                </>
              ) : (
                "Ajouter la semaine"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
