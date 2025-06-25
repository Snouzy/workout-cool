// TODO: delete
const mockPrograms = [
  {
    id: "beast-mode",
    title: "BEAST MODE",
    category: "Force & Puissance",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-slate-400 to-gray-600",
    level: "Débutant",
    type: "Full body",
    duration: "4 semaines",
    frequency: "3 séances par semaine",
    sessionDuration: "20 à 30 min",
    equipment: "Élastique, Haltères, Tapis",
    description: "Prêt pour dominer tes entraînements !? Suis la programmation Beast Mode tout au long du mois de janvier !",
    participants: "75k",
    nutritionGuide: "Guide nutrition Starter Pack",
    mealPlan: "Rééquilibrage alimentaire",
    coaches: [{ name: "Jeremy", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }],
    sessions: [
      {
        week: 1,
        sessions: [
          {
            id: 1,
            title: "Beast Power : Legs & Glutes Domination",
            equipment: "Haltères, Kettlebell",
            isLocked: true,
          },
          {
            id: 2,
            title: "Upper Beast : Chest, Back & Shoulders",
            equipment: "Haltères, Barres",
            isLocked: true,
          },
          {
            id: 3,
            title: "Core Destroyer : Abs & Stability",
            equipment: "Tapis, Poids",
            isLocked: true,
          },
        ],
      },
      {
        week: 2,
        sessions: [
          {
            id: 4,
            title: "Beast Cardio : HIIT Inferno",
            equipment: "Poids du corps",
            isLocked: true,
          },
        ],
      },
      {
        week: 3,
        sessions: [
          {
            id: 5,
            title: "Beast Compound : Full Body Power",
            equipment: "Haltères, Kettlebell",
            isLocked: true,
          },
          {
            id: 6,
            title: "Beast Endurance : Strength & Stamina",
            equipment: "Élastique, Haltères",
            isLocked: true,
          },
          {
            id: 7,
            title: "Beast Agility : Speed & Coordination",
            equipment: "Poids du corps, Tapis",
            isLocked: true,
          },
        ],
      },
      {
        week: 4,
        sessions: [
          {
            id: 8,
            title: "Beast Challenge : Ultimate Test",
            equipment: "Haltères, Kettlebell, Tapis",
            isLocked: true,
          },
          {
            id: 9,
            title: "Beast Finisher : Max Intensity",
            equipment: "Poids du corps, Élastique",
            isLocked: true,
          },
        ],
      },
    ],
  },
  {
    id: "warrior-hiit",
    title: "WARRIOR HIIT",
    category: "HIIT Intense",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-red-500 to-orange-600",
    level: "Intermédiaire",
    type: "HIIT",
    duration: "6 semaines",
    frequency: "4 séances par semaine",
    sessionDuration: "25 à 40 min",
    equipment: "Poids du corps, Kettlebell",
    description: "Entraînement HIIT intense pour warriors motivés !",
    participants: "42k",
    nutritionGuide: "Guide nutrition Performance",
    mealPlan: "Plan haute performance",
    coaches: [
      { name: "Jeremy", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { name: "Warrior", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    ],
    sessions: [
      {
        week: 1,
        sessions: [
          {
            id: 1,
            title: "HIIT Warrior Foundation",
            equipment: "Poids du corps",
            isLocked: false,
          },
        ],
      },
    ],
  },
  {
    id: "alpha-strength",
    title: "ALPHA STRENGTH",
    category: "Musculation",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
    isLocked: false,
    gradient: "from-blue-500 to-indigo-600",
    level: "Avancé",
    type: "Strength",
    duration: "8 semaines",
    frequency: "5 séances par semaine",
    sessionDuration: "45 à 60 min",
    equipment: "Haltères, Barres, Banc",
    description: "Programme de musculation pour développer force et masse musculaire.",
    participants: "28k",
    nutritionGuide: "Guide nutrition Mass",
    mealPlan: "Plan prise de masse",
    coaches: [
      { name: "Alpha", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { name: "Jeremy", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    ],
    sessions: [
      {
        week: 1,
        sessions: [
          {
            id: 1,
            title: "Alpha Strength Foundation",
            equipment: "Haltères, Barres",
            isLocked: false,
          },
        ],
      },
    ],
  },
  {
    id: "titan-core",
    title: "TITAN CORE",
    category: "Gainage & Abs",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-emerald-500 to-teal-600",
    level: "Intermédiaire",
    type: "Core",
    duration: "4 semaines",
    frequency: "4 séances par semaine",
    sessionDuration: "15 à 25 min",
    equipment: "Tapis, Swiss Ball",
    description: "Développez un core de titan avec ce programme intensif !",
    participants: "35k",
    nutritionGuide: "Guide nutrition Définition",
    mealPlan: "Plan définition musculaire",
    coaches: [{ name: "Titan", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }],
    sessions: [
      {
        week: 1,
        sessions: [
          {
            id: 1,
            title: "Titan Core Basics",
            equipment: "Tapis",
            isLocked: false,
          },
        ],
      },
    ],
  },
];

export interface Program {
  id: string;
  title: string;
  category: string;
  image: string;
  isLocked: boolean;
  gradient: string;
  level: string;
  type: string;
  duration: string;
  frequency: string;
  sessionDuration: string;
  equipment: string;
  description: string;
  participants: string;
  nutritionGuide: string;
  mealPlan: string;
  coaches: Array<{ name: string; image: string }>;
  sessions: Array<{
    week: number;
    sessions: Array<{
      id: number;
      title: string;
      equipment: string;
      isLocked: boolean;
    }>;
  }>;
}

export async function getProgramData(slug: string): Promise<Program | null> {
  // TODO: real server action to get the program data from the database
  await new Promise((resolve) => setTimeout(resolve, 100));

  const program = mockPrograms.find((p) => p.id === slug);
  return program || null;
}
