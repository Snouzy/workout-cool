import { ProgramLevel, ExerciseAttributeValueEnum, ProgramVisibility, ProgramWeek } from "@prisma/client";

import { I18nText, I18nSlug } from "@/shared/types/i18n.types";
import { ProgramSessionWithExercises } from "@/entities/program-session/types/program-session.types";

// Base program type with all fields
export interface BaseProgram extends I18nText, I18nSlug {
  id: string;
  category: string;
  image: string;
  level: ProgramLevel;
  type: ExerciseAttributeValueEnum;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  equipment: ExerciseAttributeValueEnum[];
  isPremium: boolean;
  visibility: ProgramVisibility;
  isActive: boolean;
  participantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Simplified program reference
export interface ProgramReference {
  id: string;
  title: string;
  slug: string;
}

// Program with i18n reference (for navigation)
export interface ProgramI18nReference extends I18nText, I18nSlug {
  id: string;
}

// Coach type
export interface ProgramCoach {
  id: string;
  name: string;
  image: string;
  order: number;
  programId: string;
}

export interface PublicProgramResponse extends BaseProgram {
  totalEnrollments: number;
}

// Detailed program response (with weeks and sessions)
export interface ProgramDetailResponse extends BaseProgram {
  coaches: ProgramCoach[];
  totalEnrollments: number;
  weeks: ProgramWeekWithSessions[];
}

// Program week with sessions
export interface ProgramWeekWithSessions extends ProgramWeek {
  sessions: ProgramSessionWithExercises[];
}

// Session detail response
export interface SessionDetailResponse {
  session: ProgramSessionWithExercises;
  program: ProgramI18nReference;
  week: ProgramWeek;
}

// Progress tracking
export interface ProgramProgressResponse {
  enrollment: {
    id: string;
    userId: string;
    programId: string;
    currentWeek: number;
    currentSession: number;
    enrolledAt: Date;
    sessionProgress: SessionProgress[];
  } | null;
  stats: {
    totalSessions: number;
    completedSessions: number;
    completionPercentage: number;
    currentWeek: number;
    currentSession: number;
  };
}

export interface SessionProgress {
  id: string;
  enrollmentId: string;
  sessionId: string;
  startedAt: Date;
  completedAt: Date | null;
  workoutSessionId: string | null;
  session: {
    id: string;
  };
}
