import { useState, useEffect, useMemo, useCallback } from "react";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { useSession } from "@/features/auth/lib/auth-client";

import { useFavoriteExercisesService } from "./use-favorite-exercises.service";

interface ExerciseWithAttributes {
  id: string;
  name: string;
  nameEn: string;
  fullVideoImageUrl: string | null;
  attributes: Array<{
    attributeName: { name: string };
    attributeValue: { value: string };
  }>;
}

interface MuscleGroup {
  muscle: ExerciseAttributeValueEnum;
  exercises: ExerciseWithAttributes[];
}

interface UseFavoritesModalProps {
  isOpen: boolean;
  muscleGroups?: MuscleGroup[];
}

export const useFavoritesModal = ({ isOpen, muscleGroups }: UseFavoritesModalProps) => {
  const { data: session } = useSession();
  const favoriteService = useFavoriteExercisesService();
  const [favoriteExercises, setFavoriteExercises] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize favorites when modal opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const favorites = favoriteService.getAll();
      setFavoriteExercises(new Set(favorites));
      setIsInitialized(true);

      // Fetch server favorites in background if user is logged in
      if (session?.user) {
        favoriteService.fetchServerFavorites().then((serverFavorites) => {
          const localFavorites = favoriteService.getAll();
          const allFavorites = [...new Set([...localFavorites, ...serverFavorites])];
          setFavoriteExercises(new Set(allFavorites));
        });
      }
    } else if (!isOpen && isInitialized) {
      // Reset when modal closes
      setIsInitialized(false);
    }
  }, [isOpen, isInitialized, favoriteService, session?.user]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(
    (exerciseId: string) => {
      favoriteService.toggle(exerciseId);

      // Update local state optimistically
      setFavoriteExercises((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(exerciseId)) {
          newSet.delete(exerciseId);
        } else {
          newSet.add(exerciseId);
        }
        return newSet;
      });
    },
    [favoriteService],
  );

  // Get favorite exercises with their muscle groups
  const favoriteExercisesList = useMemo(() => {
    if (!muscleGroups) return [];

    const favorites: Array<ExerciseWithAttributes & { muscle: ExerciseAttributeValueEnum }> = [];
    const seenExercises = new Set<string>();

    muscleGroups.forEach((group) => {
      group.exercises.forEach((exercise) => {
        if (favoriteExercises.has(exercise.id) && !seenExercises.has(exercise.id)) {
          favorites.push({ ...exercise, muscle: group.muscle });
          seenExercises.add(exercise.id);
        }
      });
    });

    return favorites;
  }, [muscleGroups, favoriteExercises]);

  // Check if exercise is favorite
  const isFavorite = useCallback(
    (exerciseId: string) => {
      return favoriteExercises.has(exerciseId);
    },
    [favoriteExercises],
  );

  return {
    favoriteExercises: favoriteExercisesList,
    isFavorite,
    handleToggleFavorite,
  };
};
