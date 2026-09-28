-- Add Traditional Chinese program fields.
-- Existing rows are initialized from zh-CN content so populated databases can
-- migrate safely while zh-TW gets dedicated program, week, session, and
-- exercise instruction columns.

ALTER TABLE "programs"
ADD COLUMN "slugZhTw" TEXT,
ADD COLUMN "titleZhTw" TEXT,
ADD COLUMN "descriptionZhTw" TEXT;

UPDATE "programs"
SET
  "slugZhTw" = "slugZhCn",
  "titleZhTw" = "titleZhCn",
  "descriptionZhTw" = "descriptionZhCn"
WHERE "slugZhTw" IS NULL
  OR "titleZhTw" IS NULL
  OR "descriptionZhTw" IS NULL;

ALTER TABLE "programs"
ALTER COLUMN "slugZhTw" SET NOT NULL,
ALTER COLUMN "titleZhTw" SET NOT NULL,
ALTER COLUMN "descriptionZhTw" SET NOT NULL;

CREATE UNIQUE INDEX "programs_slugZhTw_key" ON "programs"("slugZhTw");

ALTER TABLE "program_weeks"
ADD COLUMN "titleZhTw" TEXT,
ADD COLUMN "descriptionZhTw" TEXT;

UPDATE "program_weeks"
SET
  "titleZhTw" = "titleZhCn",
  "descriptionZhTw" = "descriptionZhCn"
WHERE "titleZhTw" IS NULL
  OR "descriptionZhTw" IS NULL;

ALTER TABLE "program_weeks"
ALTER COLUMN "titleZhTw" SET NOT NULL,
ALTER COLUMN "descriptionZhTw" SET NOT NULL;

ALTER TABLE "program_sessions"
ADD COLUMN "titleZhTw" TEXT,
ADD COLUMN "slugZhTw" TEXT,
ADD COLUMN "descriptionZhTw" TEXT;

UPDATE "program_sessions"
SET
  "titleZhTw" = "titleZhCn",
  "slugZhTw" = "slugZhCn",
  "descriptionZhTw" = "descriptionZhCn"
WHERE "titleZhTw" IS NULL
  OR "slugZhTw" IS NULL
  OR "descriptionZhTw" IS NULL;

ALTER TABLE "program_sessions"
ALTER COLUMN "titleZhTw" SET NOT NULL,
ALTER COLUMN "slugZhTw" SET NOT NULL,
ALTER COLUMN "descriptionZhTw" SET NOT NULL;

CREATE UNIQUE INDEX "program_sessions_weekId_slugZhTw_key" ON "program_sessions"("weekId", "slugZhTw");

ALTER TABLE "program_session_exercises"
ADD COLUMN "instructionsZhTw" TEXT;

UPDATE "program_session_exercises"
SET "instructionsZhTw" = "instructionsZhCn"
WHERE "instructionsZhTw" IS NULL;

ALTER TABLE "program_session_exercises"
ALTER COLUMN "instructionsZhTw" SET NOT NULL;
