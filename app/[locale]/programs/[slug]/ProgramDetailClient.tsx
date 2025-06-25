"use client";

import { useQueryState, parseAsString } from "nuqs";
import Image from "next/image";
import { BarChart3, Target, Clock, Calendar, Timer, Dumbbell, Share, Lock } from "lucide-react";

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
}

export function ProgramDetailClient({ program }: ProgramDetailClientProps) {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("about"));

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-auto pb-20">
        {/* Hero Image Section */}
        <div className="relative h-64 bg-gradient-to-br from-gray-800 to-black">
          <Image alt={program.title} className="absolute inset-0 object-cover" fill src={program.image} />
          <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-60`}></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative h-full flex items-end p-6">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs">Force</span>
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs">Performance</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{program.title}</h1>
            </div>
          </div>
        </div>

        <div className="p-4">
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
            <div className="tab-content bg-base-100 border-base-300 rounded-md rounded-tl-none p-6" role="tabpanel">
              <div className="space-y-6">
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rejoint par + de {program.participants} warriors</span>
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
                        <Image alt={coach.name} className="w-16 h-16 rounded-full" height={64} src={coach.image} width={64} />
                        <span className="text-sm font-medium">{coach.name}</span>
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
                {/* Week Selector */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {program.sessions.map((weekData, index) => (
                    <button
                      className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        index === 0
                          ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      }`}
                      key={weekData.week}
                    >
                      Sem {weekData.week}
                    </button>
                  ))}
                </div>

                {/* Current Week Title */}
                <h2 className="text-xl font-bold">Semaine 1</h2>

                {/* Sessions List */}
                <div className="space-y-4">
                  {program.sessions[0]?.sessions.map((session) => (
                    <div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
                      key={session.id}
                    >
                      {/* Lock Icon */}
                      {session.isLocked && (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Lock className="text-white" size={16} />
                        </div>
                      )}

                      {/* Session Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Séance {session.id} : {session.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{session.equipment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
