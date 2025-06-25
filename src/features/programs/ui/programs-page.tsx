import Image from "next/image";
import { TrendingUp, Crown } from "lucide-react";

import { getPublicPrograms } from "../actions/get-public-programs.action";
import { ProgramCard } from "./program-card";

export async function ProgramsPage() {
  const programs = await getPublicPrograms();

  const premiumPrograms = programs.filter((p) => p.isPremium);
  const freePrograms = programs.filter((p) => !p.isPremium);

  if (programs.length === 0) {
    return (
      <div className="flex flex-col">
        {/* Hero Section */}
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

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Image
              alt="Aucun programme"
              className="mx-auto mb-4 opacity-50"
              height={64}
              src="/images/emojis/WorkoutCoolSad.png"
              width={64}
            />
            <h3 className="text-lg font-semibold mb-2">Aucun programme disponible</h3>
            <p className="text-base-content/60">Les programmes seront bientôt disponibles !</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
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
        {/* Premium Programs Section */}
        {premiumPrograms.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Crown className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-base-content dark:text-gray-100">Premium Programs</h3>
              <div className="w-8 h-8 relative">
                <Image
                  alt="Emoji premium"
                  className="w-full h-full object-contain"
                  height={32}
                  src="/images/emojis/WorkoutCoolLove.png"
                  width={32}
                />
              </div>
            </div>

            {/* Premium programs with featured layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {premiumPrograms.map((program, index) => (
                <ProgramCard
                  featured={index === 0} // Premier programme en featured
                  key={program.id}
                  program={program}
                  size="large"
                />
              ))}
            </div>
          </div>
        )}

        {/* Free Programs Section */}
        {freePrograms.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-[#4F8EF7]" size={24} />
              <h3 className="text-xl font-bold text-base-content dark:text-gray-100">Free Programs</h3>
              <div className="w-8 h-8 relative">
                <Image
                  alt="Emoji free"
                  className="w-full h-full object-contain"
                  height={32}
                  src="/images/emojis/WorkoutCoolTeeths.png"
                  width={32}
                />
              </div>
            </div>

            {/* Free programs in regular grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {freePrograms.map((program) => (
                <ProgramCard key={program.id} program={program} size="medium" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
