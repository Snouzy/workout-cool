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
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWeekModal({ week, open, onOpenChange }: EditWeekModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("fr");
  const [formData, setFormData] = useState({
    title: week.title,
    titleEn: week.titleEn,
    titleEs: week.titleEs,
    titlePt: week.titlePt,
    titleRu: week.titleRu,
    titleZhCn: week.titleZhCn,
    description: week.description,
    descriptionEn: week.descriptionEn,
    descriptionEs: week.descriptionEs,
    descriptionPt: week.descriptionPt,
    descriptionRu: week.descriptionRu,
    descriptionZhCn: week.descriptionZhCn,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateWeek(week.id, formData);
      setActiveTab("fr");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving week:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
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
          <h3 className="font-bold text-lg">Éditer la Semaine {week.weekNumber}</h3>
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
                    placeholder="Titre de la semaine"
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Week title"
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                    placeholder="Título de la semana"
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                    placeholder="Título da semana"
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                    placeholder="Название недели"
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleZhCn: e.target.value })}
                    placeholder="周标题"
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, descriptionZhCn: e.target.value })}
                    placeholder="本周描述..."
                    value={formData.descriptionZhCn}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" disabled={isSaving} onClick={handleClose} type="button">
              Annuler
            </button>
            <button className="btn btn-primary" disabled={isSaving} type="submit">
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
        </form>
      </div>
    </div>
  );
}
