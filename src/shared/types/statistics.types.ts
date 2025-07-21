// Export the type for use in other modules
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

// Weight Progression Types
export interface WeightProgressionPoint {
  date: string; // ISO date string
  weight: number;
}

export interface WeightProgressionResponse {
  exerciseId: string;
  timeframe: StatisticsTimeframe;
  data: WeightProgressionPoint[];
  count: number;
}

// One Rep Max Types
export interface OneRepMaxPoint {
  date: string; // ISO date string
  estimatedOneRepMax: number;
}

export interface OneRepMaxResponse {
  exerciseId: string;
  timeframe: StatisticsTimeframe;
  formula: "Lombardi";
  formulaDescription: string;
  data: OneRepMaxPoint[];
  count: number;
}

// Volume Types
export interface VolumePoint {
  week: string; // Format: "YYYY-WXX"
  weekStart: string; // ISO date string
  totalVolume: number;
  setCount: number;
}

export interface VolumeResponse {
  exerciseId: string;
  timeframe: StatisticsTimeframe;
  data: VolumePoint[];
  count: number;
  calculationNote: string;
}

// Combined Statistics Response
export interface ExerciseStatisticsResponse {
  exerciseId: string;
  timeframe: StatisticsTimeframe;
  statistics: {
    weightProgression: WeightProgressionPoint[];
    estimatedOneRepMax: OneRepMaxPoint[];
    volume: VolumePoint[];
  };
}

// Error Response Types
export interface StatisticsErrorResponse {
  error: "UNAUTHORIZED" | "PREMIUM_REQUIRED" | "INVALID_PARAMETERS" | "INVALID_TIMEFRAME" | "INTERNAL_SERVER_ERROR";
  message: string;
  isPremium?: boolean;
  details?: any;
}

// Request Parameters
export interface StatisticsRequestParams {
  exerciseId: string;
  timeframe?: StatisticsTimeframe;
}

// Exercise List Types
export interface ExerciseAttribute {
  id: string;
  attributeName: {
    id: string;
    name: string;
  };
  attributeValue: {
    id: string;
    value: string;
  };
}

export interface ExercisesPaginationResponse {
  data: ExerciseWithAttributes[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ExercisesListRequestParams {
  page?: number;
  limit?: number;
  search?: string;
  muscle?: string;
  equipment?: string;
}
