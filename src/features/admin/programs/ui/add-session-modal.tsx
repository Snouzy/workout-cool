"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { generateSlugsForAllLanguages } from "@/shared/lib/slug";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { addSessionToWeek } from "../actions/add-session.action";

const sessionSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  titleEn: z.string().min(1, "Le titre en anglais est requis"),
  titleEs: z.string().min(1, "Le titre en espagnol est requis"),
  titlePt: z.string().min(1, "Le titre en portugais est requis"),
  titleRu: z.string().min(1, "Le titre en russe est requis"),
  titleZhCn: z.string().min(1, "Le titre en chinois est requis"),
  description: z.string().min(1, "La description est requise"),
  descriptionEn: z.string().min(1, "La description en anglais est requise"),
  descriptionEs: z.string().min(1, "La description en espagnol est requise"),
  descriptionPt: z.string().min(1, "La description en portugais est requise"),
  descriptionRu: z.string().min(1, "La description en russe est requise"),
  descriptionZhCn: z.string().min(1, "La description en chinois est requise"),
  estimatedMinutes: z.number().min(5, "Au moins 5 minutes"),
  isPremium: z.boolean(),
  equipment: z.array(z.string()),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekId: string;
  nextSessionNumber: number;
}

const EQUIPMENT_OPTIONS = [
  { value: "BODY_ONLY", label: "Poids du corps" },
  { value: "DUMBBELL", label: "Haltères" },
  { value: "BARBELL", label: "Barre" },
  { value: "KETTLEBELLS", label: "Kettlebells" },
  { value: "BANDS", label: "Élastiques" },
  { value: "MACHINE", label: "Machines" },
  { value: "CABLE", label: "Câbles" },
];

export function AddSessionModal({ open, onOpenChange, weekId, nextSessionNumber }: AddSessionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("fr");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: `Séance ${nextSessionNumber}`,
      titleEn: `Session ${nextSessionNumber}`,
      titleEs: `Sesión ${nextSessionNumber}`,
      titlePt: `Sessão ${nextSessionNumber}`,
      titleRu: `Сессия ${nextSessionNumber}`,
      titleZhCn: `第${nextSessionNumber}节`,
      description: `Description de la séance ${nextSessionNumber}`,
      descriptionEn: `Description of session ${nextSessionNumber}`,
      descriptionEs: `Descripción de la sesión ${nextSessionNumber}`,
      descriptionPt: `Descrição da sessão ${nextSessionNumber}`,
      descriptionRu: `Описание сессии ${nextSessionNumber}`,
      descriptionZhCn: `第${nextSessionNumber}节课程描述`,
      estimatedMinutes: 30,
      isPremium: true,
      equipment: [],
    },
  });

  const toggleEquipment = (equipment: string) => {
    const newEquipment = selectedEquipment.includes(equipment)
      ? selectedEquipment.filter((e) => e !== equipment)
      : [...selectedEquipment, equipment];

    setSelectedEquipment(newEquipment);
    setValue("equipment", newEquipment);
  };

  const onSubmit = async (data: SessionFormData) => {
    setIsLoading(true);
    try {
      // Generate slugs from titles
      const slugs = generateSlugsForAllLanguages({
        title: data.title,
        titleEn: data.titleEn,
        titleEs: data.titleEs,
        titlePt: data.titlePt,
        titleRu: data.titleRu,
        titleZhCn: data.titleZhCn,
      });

      await addSessionToWeek({
        weekId,
        sessionNumber: nextSessionNumber,
        ...data,
        ...slugs,
      });

      reset();
      setSelectedEquipment([]);
      onOpenChange(false);
      window.location.reload(); // Refresh to show new session
    } catch (error) {
      console.error("Error adding session:", error);
      alert("Erreur lors de l'ajout de la séance");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedEquipment([]);
    setActiveTab("fr");
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une séance</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                <Label htmlFor="title">Titre (Français)</Label>
                <Input id="title" {...register("title")} placeholder={`Séance ${nextSessionNumber}`} />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description (Français)</Label>
                <Textarea id="description" {...register("description")} placeholder="Description de cette séance..." rows={3} />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleEn">Title (English)</Label>
                <Input id="titleEn" {...register("titleEn")} placeholder={`Session ${nextSessionNumber}`} />
                {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionEn">Description (English)</Label>
                <Textarea id="descriptionEn" {...register("descriptionEn")} placeholder="Session description..." rows={3} />
                {errors.descriptionEn && <p className="text-sm text-red-500 mt-1">{errors.descriptionEn.message}</p>}
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {activeTab === "es" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleEs">Título (Español)</Label>
                <Input id="titleEs" {...register("titleEs")} placeholder={`Sesión ${nextSessionNumber}`} />
                {errors.titleEs && <p className="text-sm text-red-500 mt-1">{errors.titleEs.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionEs">Descripción (Español)</Label>
                <Textarea id="descriptionEs" {...register("descriptionEs")} placeholder="Descripción de la sesión..." rows={3} />
                {errors.descriptionEs && <p className="text-sm text-red-500 mt-1">{errors.descriptionEs.message}</p>}
              </div>
            </div>
          )}

          {/* Portuguese Fields */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titlePt">Título (Português)</Label>
                <Input id="titlePt" {...register("titlePt")} placeholder={`Sessão ${nextSessionNumber}`} />
                {errors.titlePt && <p className="text-sm text-red-500 mt-1">{errors.titlePt.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionPt">Descrição (Português)</Label>
                <Textarea id="descriptionPt" {...register("descriptionPt")} placeholder="Descrição da sessão..." rows={3} />
                {errors.descriptionPt && <p className="text-sm text-red-500 mt-1">{errors.descriptionPt.message}</p>}
              </div>
            </div>
          )}

          {/* Russian Fields */}
          {activeTab === "ru" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleRu">Название (Русский)</Label>
                <Input id="titleRu" {...register("titleRu")} placeholder={`Сессия ${nextSessionNumber}`} />
                {errors.titleRu && <p className="text-sm text-red-500 mt-1">{errors.titleRu.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionRu">Описание (Русский)</Label>
                <Textarea id="descriptionRu" {...register("descriptionRu")} placeholder="Описание сессии..." rows={3} />
                {errors.descriptionRu && <p className="text-sm text-red-500 mt-1">{errors.descriptionRu.message}</p>}
              </div>
            </div>
          )}

          {/* Chinese Fields */}
          {activeTab === "zh" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleZhCn">标题 (中文)</Label>
                <Input id="titleZhCn" {...register("titleZhCn")} placeholder={`第${nextSessionNumber}节`} />
                {errors.titleZhCn && <p className="text-sm text-red-500 mt-1">{errors.titleZhCn.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionZhCn">描述 (中文)</Label>
                <Textarea id="descriptionZhCn" {...register("descriptionZhCn")} placeholder="课程描述..." rows={3} />
                {errors.descriptionZhCn && <p className="text-sm text-red-500 mt-1">{errors.descriptionZhCn.message}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedMinutes">Durée estimée (minutes)</Label>
              <Input id="estimatedMinutes" min="5" type="number" {...register("estimatedMinutes", { valueAsNumber: true })} />
              {errors.estimatedMinutes && <p className="text-sm text-red-500 mt-1">{errors.estimatedMinutes.message}</p>}
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch defaultChecked={true} id="isPremium" onCheckedChange={(checked) => setValue("isPremium", checked)} />
              <Label htmlFor="isPremium">Séance premium</Label>
            </div>
          </div>

          <div>
            <Label>Équipement requis</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EQUIPMENT_OPTIONS.map((option) => (
                <Badge
                  className="cursor-pointer"
                  key={option.value}
                  onClick={() => toggleEquipment(option.value)}
                  variant={selectedEquipment.includes(option.value) ? "default" : "outline"}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleClose} type="button" variant="outline">
              Annuler
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Ajout..." : "Ajouter la séance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
