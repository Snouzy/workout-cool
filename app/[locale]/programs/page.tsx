import Image from "next/image";
import { Metadata } from "next";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez nos programmes d'entraînement structurés pour tous les niveaux",
};

const mockPrograms = [
  {
    id: "beast-mode",
    title: "BEAST MODE",
    category: "Force & Puissance",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-slate-400 to-gray-600",
  },
  {
    id: "warrior-hiit",
    title: "WARRIOR HIIT",
    category: "HIIT Intense",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "alpha-strength",
    title: "ALPHA STRENGTH",
    category: "Musculation",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=600&fit=crop",
    isLocked: false,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "titan-core",
    title: "TITAN CORE",
    category: "Gainage & Abs",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=600&fit=crop",
    isLocked: true,
    gradient: "from-emerald-500 to-teal-600",
  },
];

export default function ProgrammesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section */}

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Latest Programs Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-base-content dark:text-gray-100">Nos nouveaux programmes 🔥</h3>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {mockPrograms.slice(0, 2).map((program) => (
              <div className="relative flex-shrink-0 w-56 h-32 rounded-2xl overflow-hidden" key={program.id}>
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient}`}></div>
                <Image
                  alt={program.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                  fill
                  src={program.image}
                />
                <div className="absolute inset-0 bg-black/30"></div>

                {program.isLocked && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Lock className="text-white" size={14} />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-bold text-lg mb-1 leading-tight">{program.title}</h4>
                  <p className="text-sm opacity-90">{program.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Discipline Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-base-content dark:text-gray-100">Par thématique</h3>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {mockPrograms.slice(2).map((program) => (
              <div className="relative flex-shrink-0 w-56 h-32 rounded-2xl overflow-hidden" key={program.id}>
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient}`}></div>
                <Image
                  alt={program.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                  fill
                  src={program.image}
                />
                <div className="absolute inset-0 bg-black/30"></div>

                {program.isLocked && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Lock className="text-white" size={14} />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-bold text-lg mb-1 leading-tight">{program.title}</h4>
                  <p className="text-sm opacity-90">{program.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
