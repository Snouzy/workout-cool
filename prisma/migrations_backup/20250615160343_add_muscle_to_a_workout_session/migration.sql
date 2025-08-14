-- AlterTable
ALTER TABLE "workout_sessions" ADD COLUMN     "muscles" "ExerciseAttributeValueEnum"[] DEFAULT ARRAY[]::"ExerciseAttributeValueEnum"[];
