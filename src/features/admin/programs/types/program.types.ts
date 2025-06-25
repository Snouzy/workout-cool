import { 
  Program, 
  ProgramWeek, 
  ProgramSession, 
  ProgramSessionExercise, 
  ProgramSuggestedSet,
  ProgramCoach,
  Exercise,
  ExerciseAttribute,
  ExerciseAttributeName,
  ExerciseAttributeValue,
  UserProgramEnrollment
} from "@prisma/client";

// Type pour getProgramById avec toutes les associations
export type ProgramWithFullDetails = Program & {
  coaches: ProgramCoach[];
  weeks: (ProgramWeek & {
    sessions: (ProgramSession & {
      exercises: (ProgramSessionExercise & {
        exercise: Exercise & {
          attributes: (ExerciseAttribute & {
            attributeName: ExerciseAttributeName;
            attributeValue: ExerciseAttributeValue;
          })[];
        };
        suggestedSets: ProgramSuggestedSet[];
      })[];
    })[];
  })[];
};

// Type pour getPrograms avec les propriétés calculées
export type ProgramWithStats = Program & {
  coaches: ProgramCoach[];
  weeks: (ProgramWeek & {
    sessions: (ProgramSession & {
      exercises: (ProgramSessionExercise & {
        exercise: Exercise;
        suggestedSets: ProgramSuggestedSet[];
      })[];
    })[];
  })[];
  enrollments: Pick<UserProgramEnrollment, "id">[];
  // Propriétés calculées
  totalEnrollments: number;
  totalWeeks: number;
  totalSessions: number;
  totalExercises: number;
};

// Type pour une semaine avec ses sessions
export type WeekWithSessions = ProgramWeek & {
  sessions: (ProgramSession & {
    exercises: (ProgramSessionExercise & {
      exercise: Exercise;
      suggestedSets: ProgramSuggestedSet[];
    })[];
  })[];
};

// Type pour une session avec ses exercices
export type SessionWithExercises = ProgramSession & {
  exercises: (ProgramSessionExercise & {
    exercise: Exercise;
    suggestedSets: ProgramSuggestedSet[];
  })[];
};

// Type pour un exercice avec ses attributs complets (pour le modal)
export type ExerciseWithAttributes = Exercise & {
  attributes: (ExerciseAttribute & {
    attributeName: ExerciseAttributeName;
    attributeValue: ExerciseAttributeValue;
  })[];
};