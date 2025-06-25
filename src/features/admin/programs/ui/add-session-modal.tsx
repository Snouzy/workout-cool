"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ExerciseAttributeValueEnum } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

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
  description: z.string().min(1, "La description est requise"),
  descriptionEn: z.string().min(1, "La description en anglais est requise"),
  estimatedMinutes: z.number().min(5, "Au moins 5 minutes"),
  isPremium: z.boolean(),
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekId: string;
  nextSessionNumber: number;
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

export function AddSessionModal({ open, onOpenChange, weekId, nextSessionNumber }: AddSessionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseAttributeValueEnum[]>([]);

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
      estimatedMinutes: 30,
      isPremium: true,
      equipment: [],
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
      await addSessionToWeek({
        weekId,
        sessionNumber: nextSessionNumber,
        ...data,
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
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une séance</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre (FR)</Label>
              <Input id="title" {...register("title")} placeholder={`Séance ${nextSessionNumber}`} />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="titleEn">Titre (EN)</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder={`Session ${nextSessionNumber}`} />
              {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description (FR)</Label>
              <Textarea id="description" {...register("description")} placeholder="Description de cette séance..." rows={3} />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="descriptionEn">Description (EN)</Label>
              <Textarea id="descriptionEn" {...register("descriptionEn")} placeholder="Session description..." rows={3} />
              {errors.descriptionEn && <p className="text-sm text-red-500 mt-1">{errors.descriptionEn.message}</p>}
            </div>
          </div>

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
