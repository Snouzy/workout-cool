-- Allow fractional weight values (e.g. 2.5 kg / 7.5 kg) in set value arrays.
-- valuesInt is shared by WEIGHT/REPS columns; Float preserves existing integers.

ALTER TABLE "workout_sets"
  ALTER COLUMN "valuesInt" TYPE DOUBLE PRECISION[]
  USING "valuesInt"::DOUBLE PRECISION[];

ALTER TABLE "program_suggested_sets"
  ALTER COLUMN "valuesInt" TYPE DOUBLE PRECISION[]
  USING "valuesInt"::DOUBLE PRECISION[];
