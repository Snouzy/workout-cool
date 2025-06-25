import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Lock, Star, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez nos programmes d'entraînement gamifiés pour tous les niveaux - Rejoins la communauté WorkoutCool !",
};

const mockPrograms = [
  {
    id: "beast-mode",
    title: "BEAST MODE",
    category: "Force & Puissance",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-slate-400 to-gray-600",
    emoji: "WorkoutCoolSwag.png",
    isNew: true,
    difficulty: "Débutant",
    participants: "75k+",
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
  },
  {
    id: "alpha-strength",
    title: "ALPHA STRENGTH",
    category: "Musculation",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
    isLocked: false,
    gradient: "from-blue-500 to-indigo-600",
    emoji: "WorkoutCoolHappy.png",
    isNew: false,
    difficulty: "Avancé",
    participants: "28k+",
  },
  {
    id: "titan-core",
    title: "TITAN CORE",
    category: "Gainage & Abs",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-emerald-500 to-teal-600",
    emoji: "WorkoutCoolTeeths.png",
    isNew: false,
    difficulty: "Intermédiaire",
    participants: "35k+",
  },
];

export default function ProgrammesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section with Mascot */}
      <div className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Programmes d'entraînement</h1>
            <p className="text-white/90 text-sm">Choisis ton défi et deviens plus fort ! 💪</p>
          </div>
          <div className="w-16 h-16 relative">
            <Image
              alt="Mascotte WorkoutCool"
              className="w-full h-full object-contain"
              height={64}
              src="/images/emojis/WorkoutCoolHappy.png"
              width={64}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Latest Programs Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-[#4F8EF7]" size={24} />
            <h3 className="text-xl font-bold text-base-content dark:text-gray-100">Nouveaux programmes</h3>
            <div className="w-8 h-8 relative">
              <Image
                alt="Emoji fire"
                className="w-full h-full object-contain"
                height={32}
                src="/images/emojis/WorkoutCoolSwag.png"
                width={32}
              />
            </div>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large featured card */}
            <div className="md:col-span-2">
              <Link
                className="relative block h-48 rounded-xl overflow-hidden border-2 border-[#4F8EF7]/20 hover:border-[#4F8EF7] hover:scale-[1.02] transition-all duration-200 ease-in-out"
                href={`/programs/${mockPrograms[0].id}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mockPrograms[0].gradient}`}></div>
                <Image
                  alt={mockPrograms[0].title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                  fill
                  src={mockPrograms[0].image}
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {mockPrograms[0].isNew && (
                    <span className="bg-[#25CB78] text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Star size={12} /> NOUVEAU
                    </span>
                  )}
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {mockPrograms[0].difficulty}
                  </span>
                </div>

                {/* Lock/Emoji */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {mockPrograms[0].isLocked ? (
                    <Lock className="text-white" size={16} />
                  ) : (
                    <Image
                      alt="Emoji"
                      className="w-6 h-6 object-contain"
                      height={24}
                      src={`/images/emojis/${mockPrograms[0].emoji}`}
                      width={24}
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xl mb-2 leading-tight">{mockPrograms[0].title}</h4>
                      <p className="text-sm opacity-90 mb-1">{mockPrograms[0].category}</p>
                      <p className="text-xs opacity-75">{mockPrograms[0].participants} participants</p>
                    </div>
                    <div className="w-12 h-12 relative">
                      <Image
                        alt="Mascotte"
                        className="w-full h-full object-contain"
                        height={48}
                        src={`/images/emojis/${mockPrograms[0].emoji}`}
                        width={48}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Smaller card */}
            <div>
              <Link
                className="relative block h-48 rounded-xl overflow-hidden border-2 border-[#25CB78]/20 hover:border-[#25CB78] hover:scale-[1.02] transition-all duration-200 ease-in-out"
                href={`/programs/${mockPrograms[1].id}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mockPrograms[1].gradient}`}></div>
                <Image
                  alt={mockPrograms[1].title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                  fill
                  src={mockPrograms[1].image}
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {mockPrograms[1].isNew && (
                    <span className="bg-[#25CB78] text-white text-xs px-2 py-1 rounded-full font-medium">
                      NOUVEAU
                    </span>
                  )}
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {mockPrograms[1].difficulty}
                  </span>
                </div>

                {/* Lock/Emoji */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {mockPrograms[1].isLocked ? (
                    <Lock className="text-white" size={14} />
                  ) : (
                    <Image
                      alt="Emoji"
                      className="w-5 h-5 object-contain"
                      height={20}
                      src={`/images/emojis/${mockPrograms[1].emoji}`}
                      width={20}
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-bold text-lg mb-1 leading-tight">{mockPrograms[1].title}</h4>
                  <p className="text-xs opacity-90">{mockPrograms[1].category}</p>
                  <p className="text-xs opacity-75 mt-1">{mockPrograms[1].participants}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* By Discipline Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 relative">
              <Image
                alt="Mascotte discipline"
                className="w-full h-full object-contain"
                height={32}
                src="/images/emojis/WorkoutCoolTeeths.png"
                width={32}
              />
            </div>
            <h3 className="text-xl font-bold text-base-content dark:text-gray-100">Par discipline</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockPrograms.slice(2).map((program) => (
              <Link
                className="relative block h-36 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-[#4F8EF7] hover:scale-[1.02] transition-all duration-200 ease-in-out"
                href={`/programs/${program.id}`}
                key={program.id}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient}`}></div>
                <Image
                  alt={program.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                  fill
                  src={program.image}
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {program.difficulty}
                  </span>
                </div>

                {/* Lock/Emoji */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {program.isLocked ? (
                    <Lock className="text-white" size={14} />
                  ) : (
                    <Image
                      alt="Emoji"
                      className="w-5 h-5 object-contain"
                      height={20}
                      src={`/images/emojis/${program.emoji}`}
                      width={20}
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <h4 className="font-bold text-lg mb-1 leading-tight">{program.title}</h4>
                      <p className="text-xs opacity-90">{program.category}</p>
                      <p className="text-xs opacity-75 mt-1">{program.participants}</p>
                    </div>
                    <div className="w-8 h-8 relative">
                      <Image
                        alt="Mascotte"
                        className="w-full h-full object-contain"
                        height={32}
                        src={`/images/emojis/${program.emoji}`}
                        width={32}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
