import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Lock, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez nos programmes d'entraînement gamifiés pour tous les niveaux - Rejoins la communauté WorkoutCool !",
};

const mockPrograms = [
  {
    id: "beast-mode",
    title: "BEAST MODE",
    category: "Strength & Power",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-slate-400 to-gray-600",
    emoji: "WorkoutCoolSwag.png",
    isNew: true,
    difficulty: "Débutant",
    participants: "75k+",
    isFeatured: true,
    displayOrder: 1,
    section: "new",
  },
  {
    id: "warrior-hiit",
    title: "WARRIOR HIIT",
    category: "HIIT Intense",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-red-500 to-orange-600",
    emoji: "WorkoutCoolExhausted.png",
    isNew: true,
    difficulty: "Intermédiaire",
    participants: "42k+",
    // Layout metadata
    isFeatured: false, // Petite carte
    displayOrder: 2,
    section: "new",
  },
  {
    id: "alpha-strength",
    title: "ALPHA GRIP",
    category: "Weightlifting",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
    isLocked: false,
    gradient: "from-blue-500 to-indigo-600",
    emoji: "WorkoutCoolHappy.png",
    isNew: false,
    difficulty: "Avancé",
    participants: "28k+",
    // Layout metadata
    isFeatured: false,
    displayOrder: 3,
    section: "discipline",
  },
  {
    id: "titan-core",
    title: "TITAN CORE",
    category: "Core & Abs",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-emerald-500 to-teal-600",
    emoji: "WorkoutCoolTeeths.png",
    isNew: false,
    difficulty: "Intermédiaire",
    participants: "35k+",
    // Layout metadata
    isFeatured: false,
    displayOrder: 4,
    section: "discipline",
  },
];

// Helper component for program cards
function ProgramCard({ program }: { program: (typeof mockPrograms)[0] }) {
  const isFeatured = program.isFeatured;
  const isNewSection = program.section === "new";

  return (
    <div className={isFeatured ? "md:col-span-2" : ""}>
      <Link
        className={`relative block rounded-xl overflow-hidden border-2 transition-all  ease-in-out ${
          isFeatured
            ? "h-48 border-[#4F8EF7]/20 hover:border-[#4F8EF7] hover:scale-[1.01]"
            : isNewSection
              ? "h-48 border-[#25CB78]/20 hover:border-[#25CB78] hover:scale-[1.02]"
              : "h-36 border-gray-200 dark:border-gray-700 hover:border-[#4F8EF7] hover:scale-[1.02]"
        }`}
        href={`/programs/${program.id}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient}`}></div>
        <Image alt={program.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" fill src={program.image} />
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Badges */}
        <div className={`absolute ${isFeatured ? "top-4 left-4" : "top-3 left-3"} flex flex-wrap gap-2`}>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">{program.difficulty}</span>
        </div>

        {/* Lock/Emoji */}
        <div
          className={`absolute ${isFeatured ? "top-4 right-4 w-10 h-10" : "top-3 right-3 w-8 h-8"} bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center`}
        >
          {program.isLocked ? (
            <Lock className="text-white" size={isFeatured ? 16 : 14} />
          ) : (
            <Image
              alt="Emoji"
              className={`object-contain ${isFeatured ? "w-6 h-6" : "w-5 h-5"}`}
              height={isFeatured ? 24 : 20}
              src={`/images/emojis/${program.emoji}`}
              width={isFeatured ? 24 : 20}
            />
          )}
        </div>

        {/* Content */}
        <div className={`absolute bottom-0 left-0 right-0 ${isFeatured ? "p-6" : "p-4"} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-bold leading-tight ${isFeatured ? "text-xl mb-2" : "text-lg mb-1"}`}>{program.title}</h4>
              <p className={`opacity-90 ${isFeatured ? "text-sm mb-1" : "text-xs"}`}>{program.category}</p>
              <p className="text-xs opacity-75">{program.participants} participants</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ProgrammesPage() {
  // Filter programs by section
  const newPrograms = mockPrograms.filter((p) => p.section === "new").sort((a, b) => a.displayOrder - b.displayOrder);
  const disciplinePrograms = mockPrograms.filter((p) => p.section === "discipline").sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="flex flex-col ">
      {/* Hero Section with Mascot */}
      <div className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl leading-tight font-bold mb-2">Workout programs</h1>
            <p className="text-white/90 text-sm">Choose your challenge and become stronger! 💪</p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 relative">
            <Image
              alt="Mascotte WorkoutCool"
              className="object-contain h-14 w-14 sm:h-16 sm:w-16"
              height={64}
              src="/images/emojis/WorkoutCoolHappy.png"
              width={64}
            />
          </div>
        </div>
      </div>

      <div className="overflow-auto p-4 space-y-6">
        {/* Latest Programs Section */}
        {newPrograms.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-[#4F8EF7]" size={24} />
              <h3 className="text-xl font-bold text-base-content dark:text-gray-100">New programs</h3>
              <div className="w-8 h-8 relative">
                <Image
                  alt="Emoji fire"
                  className="w-full h-full object-contain"
                  height={32}
                  src="/images/emojis/WorkoutCoolLove.png"
                  width={32}
                />
              </div>
            </div>

            {/* Dynamic Asymmetric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}

        {/* By Discipline Section */}
        {disciplinePrograms.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-base-content dark:text-gray-100">By discipline</h3>
              <div className="w-8 h-8 relative">
                <Image
                  alt="Mascotte discipline"
                  className="w-full h-full object-contain"
                  height={32}
                  src="/images/emojis/WorkoutCoolTeeths.png"
                  width={32}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {disciplinePrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
