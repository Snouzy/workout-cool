import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { BarChart3, Target, Clock, Calendar, Timer, Dumbbell, Share } from "lucide-react";

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
    description: "Prête pour une reprise du sport !? Suis la programmation de Beast tout au long du mois de janvier !",
    fullDescription:
      "Beast Mode est le programme parfait pour les débutants ou celles qui souhaitent reprendre le sport en douceur. Avec des exercices au poids du corps et des accessoires simples, ce programme vous permettra de retrouver la forme progressivement.",
    participants: "75k",
    nutritionGuide: "Guide nutrition Starter Pack",
    mealPlan: "Rééquilibrage alimentaire",
    coaches: [{ name: "Jeremy", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }],
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
    fullDescription: "Warrior HIIT est conçu pour ceux qui veulent repousser leurs limites avec des séances courtes mais intenses.",
    participants: "42k",
    nutritionGuide: "Guide nutrition Performance",
    mealPlan: "Plan haute performance",
    coaches: [
      { name: "Jeremy", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { name: "Warrior", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
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
    fullDescription:
      "Alpha Strength est le programme ultime pour ceux qui veulent construire un physique impressionnant et développer une force exceptionnelle.",
    participants: "28k",
    nutritionGuide: "Guide nutrition Mass",
    mealPlan: "Plan prise de masse",
    coaches: [
      { name: "Alpha", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { name: "Jeremy", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
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
    fullDescription: "Titan Core se concentre exclusivement sur le renforcement du core pour une stabilité et une force exceptionnelles.",
    participants: "35k",
    nutritionGuide: "Guide nutrition Définition",
    mealPlan: "Plan définition musculaire",
    coaches: [{ name: "Titan", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }],
  },
];

interface ProgramDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = mockPrograms.find((p) => p.id === slug);

  if (!program) {
    return { title: "Programme non trouvé" };
  }

  return {
    title: `${program.title} - Programme`,
    description: program.description,
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = mockPrograms.find((p) => p.id === slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-auto pb-20">
        {/* Hero Image Section */}
        <div className="relative h-64 bg-gradient-to-br from-gray-800 to-black">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative h-full flex items-end p-6">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs">Tonification</span>
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs">Bien-Être</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Tabs */}
          <div className="flex gap-4">
            <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">À propos</button>
            <button className="text-gray-500 px-6 py-2 text-sm font-medium">Les séances</button>
          </div>

          {/* Community Stats */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {program.coaches.slice(0, 3).map((coach, index) => (
                <Image
                  alt={coach.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  height={32}
                  key={index}
                  src={coach.image}
                  width={32}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Joined by +{program.participants} cool people</span>
            <div className="ml-auto flex gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Share className="text-gray-600 dark:text-gray-400" size={20} />
              </button>
            </div>
          </div>

          {/* Program Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-primary" size={20} />
                <div>
                  <div className="text-sm font-medium">{program.level}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="text-primary" size={20} />
                <div>
                  <div className="text-sm font-medium">{program.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-primary" size={20} />
                <div>
                  <div className="text-sm font-medium">{program.duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-primary" size={20} />
                <div>
                  <div className="text-sm font-medium">{program.frequency}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="text-primary" size={20} />
                <div>
                  <div className="text-sm font-medium">{program.sessionDuration}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Dumbbell className="text-primary" size={20} />
                <div>
                  <div className="text-sm font-medium">{program.equipment}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{program.description}</p>
          </div>

          {/* Coaches */}
          <div>
            <h3 className="text-lg font-bold mb-3">Coachs :</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {program.coaches.map((coach, index) => (
                <div className="flex flex-col items-center gap-2 flex-shrink-0" key={index}>
                  <Image alt={coach.name} className="w-20 h-20 rounded-full" height={80} src={coach.image} width={80} />
                  <span className="text-sm font-medium">{coach.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <button className="absolute bottom-6 right-0 left-0 max-w-xs mx-auto bg-primary hover:bg-slate-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 z-50">
        Rejoindre
      </button>
    </div>
  );
}
