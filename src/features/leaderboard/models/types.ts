export interface TopWorkoutUser {
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  totalWorkouts: number;
  lastWorkoutAt: Date | null;
  averageWorkoutsPerWeek: number;
  memberSince: Date;
}
