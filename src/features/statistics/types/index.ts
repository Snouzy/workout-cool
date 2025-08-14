// Re-export types from shared
export type {
  WeightProgressionPoint,
  WeightProgressionResponse,
  OneRepMaxPoint,
  OneRepMaxResponse,
  VolumePoint,
  VolumeResponse,
  ExerciseStatisticsResponse,
  StatisticsErrorResponse,
  StatisticsRequestParams,
} from "@/shared/types/statistics.types";

// Client-side specific types
export interface ChartDimensions {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
