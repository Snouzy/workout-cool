"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addWeekToProgram } from "../actions/add-week.action";

const weekSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  titleEn: z.string().min(1, "Le titre en anglais est requis"),
  description: z.string().min(1, "La description est requise"),
  descriptionEn: z.string().min(1, "La description en anglais est requise"),
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WeekFormData>({
    resolver: zodResolver(weekSchema),
    defaultValues: {
      title: `Semaine ${nextWeekNumber}`,
      titleEn: `Week ${nextWeekNumber}`,
    },
  });

  const onSubmit = async (data: WeekFormData) => {
    setIsLoading(true);
    try {
      await addWeekToProgram({
        programId,
        weekNumber: nextWeekNumber,
        ...data,
      });
      
      reset();
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
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter une semaine</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre (FR)</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder={`Semaine ${nextWeekNumber}`}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="titleEn">Titre (EN)</Label>
              <Input
                id="titleEn"
                {...register("titleEn")}
                placeholder={`Week ${nextWeekNumber}`}
              />
              {errors.titleEn && (
                <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description (FR)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Description de cette semaine..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="descriptionEn">Description (EN)</Label>
              <Textarea
                id="descriptionEn"
                {...register("descriptionEn")}
                placeholder="Week description..."
                rows={3}
              />
              {errors.descriptionEn && (
                <p className="text-sm text-red-500 mt-1">{errors.descriptionEn.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajout..." : "Ajouter la semaine"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}