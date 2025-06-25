"use client";

import { useState } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import Image from "next/image";
import { BarChart3, Target, Clock, Calendar, Timer, Dumbbell, Share, Lock, Trophy, Users, Zap } from "lucide-react";

import { WelcomeModal } from "@/features/programs/ui/welcome-modal";
import { ProgramProgress } from "@/features/programs/ui/program-progress";

interface Program {
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
  fullDescription: string;
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

interface ProgramDetailClientProps {
  program: Program;
  isAuthenticated: boolean;
}

export function ProgramDetailClient({ program, isAuthenticated }: ProgramDetailClientProps) {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("about"));
  const [selectedWeek, setSelectedWeek] = useQueryState("week", parseAsInteger.withDefault(1));
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleJoinProgram = async () => {
    try {
      const { enrollInProgram } = await import("@/features/programs/actions/enroll-program.action");
      const { enrollment } = await enrollInProgram(program.id);

      setShowWelcomeModal(false);

      // Navigate to first session
      const firstSession = program.sessions[0]?.sessions[0];
      if (firstSession) {
        window.location.href = `/programs/${program.id}/session/${firstSession.id}`;
      }
    } catch (error) {
      console.error("Failed to join program:", error);
      // TODO: Show error message
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-auto pb-20">
        {/* Hero Image Section with Gamification */}
        <div className="relative h-64 bg-gradient-to-br from-[#4F8EF7] to-[#25CB78]">
          <Image alt={program.title} className="absolute inset-0 object-cover opacity-30" fill src={program.image} />
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Mascot Emoji */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center">
            <Image
              alt="Mascotte programme"
              className="w-12 h-12 object-contain"
              height={48}
              src="/images/emojis/WorkoutCoolSwag.png"
              width={48}
            />
          </div>

          <div className="relative h-full flex items-end p-6">
            <div className="text-white flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#4F8EF7] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Zap size={12} />
                  {program.level}
                </span>
                <span className="bg-[#25CB78] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Users size={12} />
                  {program.participants}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
              <p className="text-white/90 text-sm">{program.category}</p>
            </div>
          </div>
        </div>

        <div className="px-0 sm:px-4 py-4">
          {/* DaisyUI Tabs */}
          <div className="tabs tabs-lift" role="tablist">
            <input
              aria-label="À propos"
              checked={tab === "about"}
              className="tab"
              name="program_tabs"
              onChange={() => setTab("about")}
              role="tab"
              type="radio"
            />
            <div className="tab-content bg-base-100 border-base-300 rounded-md rounded-tl-none p-2 sm:p-6" role="tabpanel">
              <div className="space-y-6">
                {/* User Progress - Only show if authenticated */}
                {isAuthenticated && <ProgramProgress programId={program.id} />}

                {/* Gamified Community Stats */}
                <div className="bg-gradient-to-r from-[#4F8EF7]/10 to-[#25CB78]/10 border-2 border-[#4F8EF7]/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {program.coaches.slice(0, 3).map((coach, index) => (
                          <Image
                            alt={coach.name}
                            className="w-10 h-10 rounded-full border-3 border-[#4F8EF7]"
                            height={40}
                            key={index}
                            src={coach.image}
                            width={40}
                          />
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Image
                            alt="Communauté"
                            className="w-6 h-6 object-contain"
                            height={24}
                            src="/images/emojis/WorkoutCoolHappy.png"
                            width={24}
                          />
                          <span className="text-sm font-bold text-[#4F8EF7]">Communauté active</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">+ de {program.participants} warriors rejoints</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-[#4F8EF7] hover:bg-[#4F8EF7]/80 text-white rounded-xl transition-all duration-200 ease-in-out hover:scale-105">
                        <Share size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gamified Program Details - Mobile Optimized */}
                <div className="bg-white dark:bg-gray-800 border-2 border-[#25CB78]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Image
                      alt="Détails"
                      className="w-6 h-6 object-contain"
                      height={24}
                      src="/images/emojis/WorkoutCoolTeeths.png"
                      width={24}
                    />
                    <h3 className="font-bold text-lg text-[#4F8EF7]">Caractéristiques</h3>
                  </div>

                  {/* Compact Layout - Mobile: List, Desktop: 2 columns */}
                  <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-4 md:space-y-0">
                    <div className="flex items-center gap-4">
                      <BarChart3 className="text-[#4F8EF7] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">{program.level}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Target className="text-[#25CB78] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">{program.type}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Clock className="text-[#4F8EF7] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">{program.duration}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Calendar className="text-[#25CB78] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">{program.frequency}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Timer className="text-[#4F8EF7] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">{program.sessionDuration}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Dumbbell className="text-[#25CB78] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">{program.equipment}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 text-center">{program.description}</p>
                </div>

                {/* Gamified Coaches Section */}
                <div className="bg-gradient-to-r from-[#25CB78]/10 to-[#4F8EF7]/10 border-2 border-[#25CB78]/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Image
                      alt="Coachs"
                      className="w-6 h-6 object-contain"
                      height={24}
                      src="/images/emojis/WorkoutCoolLove.png"
                      width={24}
                    />
                    <h3 className="text-lg font-bold text-[#25CB78]">Tes coachs warriors</h3>
                    <div className="bg-[#25CB78] text-white px-2 py-1 rounded-full text-xs font-bold">{program.coaches.length}</div>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-2">
                    {program.coaches.map((coach, index) => (
                      <div
                        className="flex flex-col items-center gap-3 flex-shrink-0 p-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-[#25CB78]/20 hover:border-[#25CB78] transition-all duration-200 ease-in-out hover:scale-105"
                        key={index}
                      >
                        <div className="relative">
                          <Image
                            alt={coach.name}
                            className="w-16 h-16 rounded-full border-3 border-[#25CB78]"
                            height={64}
                            src={coach.image}
                            width={64}
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#25CB78] rounded-full flex items-center justify-center">
                            <Trophy className="text-white" size={12} />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-center">{coach.name}</span>
                        <span className="text-xs text-[#25CB78] font-medium">Expert</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <input
              aria-label="Les séances"
              checked={tab === "sessions"}
              className="tab"
              name="program_tabs"
              onChange={() => setTab("sessions")}
              role="tab"
              type="radio"
            />
            <div className="tab-content bg-base-100 border-base-300 rounded-box p-6" role="tabpanel">
              <div className="space-y-6">
                {/* Week Selector with DaisyUI Tabs */}
                <div className="overflow-x-auto">
                  <div className="tabs tabs-box w-fit flex-nowrap">
                    {program.sessions.map((weekData) => (
                      <button
                        className={`tab flex-shrink-0 ${selectedWeek === weekData.week ? "tab-active" : ""}`}
                        key={weekData.week}
                        onClick={() => setSelectedWeek(weekData.week)}
                      >
                        Sem. {weekData.week}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Week Title */}
                <h2 className="text-xl font-bold">Semaine {selectedWeek}</h2>

                {/* Gamified Sessions List */}
                <div className="space-y-3">
                  {program.sessions
                    .find((w) => w.week === selectedWeek)
                    ?.sessions.map((session, index) => (
                      <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 ${
                          session.isLocked
                            ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10"
                            : "border-[#25CB78]/20 hover:border-[#25CB78] hover:scale-[1.02]"
                        } transition-all duration-200 ease-in-out flex items-center gap-4`}
                        key={session.id}
                      >
                        {/* Session Number Badge */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white ${
                            session.isLocked ? "bg-yellow-500" : "bg-[#25CB78]"
                          }`}
                        >
                          {session.isLocked ? <Lock size={18} /> : <span className="text-lg">{index + 1}</span>}
                        </div>

                        {/* Session Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">{session.title}</h4>
                            {!session.isLocked && (
                              <div className="bg-[#25CB78] text-white px-2 py-1 rounded-full text-xs font-bold">LIBRE</div>
                            )}
                            {session.isLocked && (
                              <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">PREMIUM</div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Dumbbell size={14} />
                            {session.equipment}
                          </p>
                        </div>

                        {/* Emoji Feedback */}
                        <div className="w-10 h-10 flex items-center justify-center">
                          <Image
                            alt="Status"
                            className="w-8 h-8 object-contain"
                            height={32}
                            src={`/images/emojis/${session.isLocked ? "WorkoutCoolCry.png" : "WorkoutCoolHappy.png"}`}
                            width={32}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Floating CTA */}
      <button
        className="absolute bottom-6 right-0 left-0 max-w-xs mx-auto bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] hover:from-[#4F8EF7]/80 hover:to-[#25CB78]/80 text-white px-8 py-4 rounded-full font-bold border-2 border-white/20 hover:scale-105 transition-all duration-200 ease-in-out z-50 flex items-center justify-center gap-2"
        onClick={() => setShowWelcomeModal(true)}
      >
        <Image alt="Rejoindre" className="w-6 h-6 object-contain" height={24} src="/images/emojis/WorkoutCoolSwag.png" width={24} />
        Rejoindre le défi
        <Trophy className="text-white" size={18} />
      </button>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onJoin={handleJoinProgram}
        programDuration={program.duration}
        programFrequency={program.frequency}
        programLevel={program.level}
        programTitle={program.title}
      />
    </div>
  );
}
