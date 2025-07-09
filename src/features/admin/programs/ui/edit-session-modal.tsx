"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ExerciseAttributeValueEnum } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { generateSlugsForAllLanguages } from "@/shared/lib/slug";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { SessionWithExercises } from "../types/program.types";
import { updateSession } from "../actions/update-session.action";

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
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface EditSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SessionWithExercises;
}

const EQUIPMENT_OPTIONS = [
  { value: ExerciseAttributeValueEnum.BODY_ONLY, label: "Poids du corps" },
  { value: ExerciseAttributeValueEnum.DUMBBELL, label: "Haltères" },
  { value: ExerciseAttributeValueEnum.BARBELL, label: "Barre" },
  { value: ExerciseAttributeValueEnum.KETTLEBELLS, label: "Kettlebells" },
  { value: ExerciseAttributeValueEnum.BANDS, label: "Élastiques" },
  { value: ExerciseAttributeValueEnum.MACHINE, label: "Machines" },
  { value: ExerciseAttributeValueEnum.CABLE, label: "Câbles" },
];

export function EditSessionModal({ open, onOpenChange, session }: EditSessionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("fr");
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseAttributeValueEnum[]>(session.equipment);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: session.title,
      titleEn: session.titleEn,
      titleEs: session.titleEs,
      titlePt: session.titlePt,
      titleRu: session.titleRu,
      titleZhCn: session.titleZhCn,
      description: session.description,
      descriptionEn: session.descriptionEn,
      descriptionEs: session.descriptionEs,
      descriptionPt: session.descriptionPt,
      descriptionRu: session.descriptionRu,
      descriptionZhCn: session.descriptionZhCn,
      estimatedMinutes: session.estimatedMinutes,
      isPremium: session.isPremium,
      equipment: session.equipment,
    },
  });

  const toggleEquipment = (equipment: ExerciseAttributeValueEnum) => {
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

      await updateSession({
        sessionId: session.id,
        ...data,
        ...slugs,
      });

      onOpenChange(false);
      window.location.reload(); // Refresh to show updated session
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Erreur lors de la mise à jour de la séance");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedEquipment(session.equipment);
    setActiveTab("fr");
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Éditer la séance</DialogTitle>
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
                <Label htmlFor="edit-title">Titre (Français)</Label>
                <Input id="edit-title" {...register("title")} />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-description">Description (Français)</Label>
                <Textarea id="edit-description" {...register("description")} rows={3} />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleEn">Title (English)</Label>
                <Input id="edit-titleEn" {...register("titleEn")} />
                {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionEn">Description (English)</Label>
                <Textarea id="edit-descriptionEn" {...register("descriptionEn")} rows={3} />
                {errors.descriptionEn && <p className="text-sm text-red-500 mt-1">{errors.descriptionEn.message}</p>}
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {activeTab === "es" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleEs">Título (Español)</Label>
                <Input id="edit-titleEs" {...register("titleEs")} />
                {errors.titleEs && <p className="text-sm text-red-500 mt-1">{errors.titleEs.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionEs">Descripción (Español)</Label>
                <Textarea id="edit-descriptionEs" {...register("descriptionEs")} rows={3} />
                {errors.descriptionEs && <p className="text-sm text-red-500 mt-1">{errors.descriptionEs.message}</p>}
              </div>
            </div>
          )}

          {/* Portuguese Fields */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titlePt">Título (Português)</Label>
                <Input id="edit-titlePt" {...register("titlePt")} />
                {errors.titlePt && <p className="text-sm text-red-500 mt-1">{errors.titlePt.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionPt">Descrição (Português)</Label>
                <Textarea id="edit-descriptionPt" {...register("descriptionPt")} rows={3} />
                {errors.descriptionPt && <p className="text-sm text-red-500 mt-1">{errors.descriptionPt.message}</p>}
              </div>
            </div>
          )}

          {/* Russian Fields */}
          {activeTab === "ru" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleRu">Название (Русский)</Label>
                <Input id="edit-titleRu" {...register("titleRu")} />
                {errors.titleRu && <p className="text-sm text-red-500 mt-1">{errors.titleRu.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionRu">Описание (Русский)</Label>
                <Textarea id="edit-descriptionRu" {...register("descriptionRu")} rows={3} />
                {errors.descriptionRu && <p className="text-sm text-red-500 mt-1">{errors.descriptionRu.message}</p>}
              </div>
            </div>
          )}

          {/* Chinese Fields */}
          {activeTab === "zh" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleZhCn">标题 (中文)</Label>
                <Input id="edit-titleZhCn" {...register("titleZhCn")} />
                {errors.titleZhCn && <p className="text-sm text-red-500 mt-1">{errors.titleZhCn.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionZhCn">描述 (中文)</Label>
                <Textarea id="edit-descriptionZhCn" {...register("descriptionZhCn")} rows={3} />
                {errors.descriptionZhCn && <p className="text-sm text-red-500 mt-1">{errors.descriptionZhCn.message}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-estimatedMinutes">Durée estimée (minutes)</Label>
              <Input id="edit-estimatedMinutes" min="5" type="number" {...register("estimatedMinutes", { valueAsNumber: true })} />
              {errors.estimatedMinutes && <p className="text-sm text-red-500 mt-1">{errors.estimatedMinutes.message}</p>}
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                defaultChecked={session.isPremium}
                id="edit-isPremium"
                onCheckedChange={(checked) => setValue("isPremium", checked)}
              />
              <Label htmlFor="edit-isPremium">Séance premium</Label>
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
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
