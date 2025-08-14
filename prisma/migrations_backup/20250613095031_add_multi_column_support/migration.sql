-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "types" "WorkoutSetType"[] DEFAULT ARRAY[]::"WorkoutSetType"[],
ADD COLUMN     "units" "WorkoutSetUnit"[] DEFAULT ARRAY[]::"WorkoutSetUnit"[],
ADD COLUMN     "valuesInt" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "valuesSec" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
