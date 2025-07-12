"use client";

import { useState, useEffect } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  Target,
  Clock,
  Calendar,
  Timer,
  Dumbbell,
  Lock,
  Trophy,
  Users,
  Zap,
  CheckCircle2,
  Unlock,
  ArrowRight,
} from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { useIsPremium } from "@/shared/lib/premium/use-premium";
import { getSlugForLocale } from "@/shared/lib/locale-slug";
import { ATTRIBUTE_VALUE_TRANSLATION_KEYS, getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { WelcomeModal } from "@/features/programs/ui/welcome-modal";
import { ShareButton } from "@/features/programs/ui/share-button";
import { ProgramProgress } from "@/features/programs/ui/program-progress";
import {
  getProgramDescription,
  getProgramTitle,
  getSessionDescription,
  getSessionTitle,
  getWeekDescription,
  getWeekTitle,
} from "@/features/programs/lib/translations-mapper";
import { env } from "@/env";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

import { getProgramProgress } from "../actions/get-program-progress.action";
import { ProgramDetail } from "../actions/get-program-by-slug.action";

interface ProgramDetailPageProps {
  program: ProgramDetail;
  isAuthenticated: boolean;
}

export function ProgramDetailPage({ program, isAuthenticated }: ProgramDetailPageProps) {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("about"));
  const [selectedWeek, setSelectedWeek] = useQueryState("week", parseAsInteger.withDefault(1));
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [_isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [hasJoinedProgram, setHasJoinedProgram] = useState(false);
  const [isProgramCompleted, setIsProgramCompleted] = useState(false);
  const t = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentLocale = useCurrentLocale();
  const isPremium = useIsPremium();
  const programTitle = getProgramTitle(program, currentLocale);
  const programDescription = getProgramDescription(program, currentLocale);
  const currentWeekFull = program.weeks.find((w) => w.weekNumber === selectedWeek);
  const currentWeekTitle = currentWeekFull ? getWeekTitle(currentWeekFull, currentLocale) : "";
  const currentWeekDescription = currentWeekFull ? getWeekDescription(currentWeekFull, currentLocale) : "";

  const localizedTitle = getProgramTitle(program, currentLocale);

  const breadcrumbItems = [
    {
      label: t("breadcrumbs.home"),
      href: `/${currentLocale}`,
    },
    {
      label: t("programs.workout_programs"),
      href: `/${currentLocale}/programs`,
    },
    {
      label: localizedTitle,
      current: true,
    },
  ];

  // Load completed sessions when component mounts or when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCompletedSessions();
    } else {
      // Reset states for non-authenticated users
      setHasJoinedProgram(false);
      setCompletedSessions(new Set());
      setSelectedWeek(1);
      setIsProgramCompleted(false);
    }
  }, [isAuthenticated]);

  // Reload progress when refresh param changes (indicating session completion)
  useEffect(() => {
    const refreshParam = searchParams.get("refresh");
    if (refreshParam && isAuthenticated) {
      loadCompletedSessions();
    }
  }, [searchParams, isAuthenticated]);

  const loadCompletedSessions = async () => {
    if (!isAuthenticated) return;

    setIsLoadingProgress(true);
    try {
      const progress = await getProgramProgress(program.id);
      if (progress?.enrollment) {
        setHasJoinedProgram(true);
        setSelectedWeek(progress.stats.currentWeek);
        setIsProgramCompleted(progress.stats.isProgramCompleted);
        if (progress.enrollment.sessionProgress) {
          const completed = new Set(
            progress.enrollment.sessionProgress.filter((sp: any) => sp.completedAt !== null).map((sp: any) => sp.session.id),
          );
          setCompletedSessions(completed);
        }
      } else {
        setHasJoinedProgram(false);
        setCompletedSessions(new Set());
        setSelectedWeek(1);
        setIsProgramCompleted(false);
      }
    } catch (error) {
      console.error("Failed to load completed sessions:", error);
      setHasJoinedProgram(false);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleCTAClick = () => {
    if (isAuthenticated && hasJoinedProgram) {
      router.push(`/programs/${program.slug}/?tab=sessions`);
    } else {
      setShowWelcomeModal(true);
    }
  };

  const handleJoinProgram = async () => {
    setShowWelcomeModal(false);

    router.push(`/programs/${program.slug}/?tab=sessions`);

    // if (isAuthenticated && hasJoinedProgram) {
    //   // Navigate to current session if user has already joined
    //   const currentWeekData = program.weeks.find((w) => w.weekNumber === selectedWeek);
    //   const currentSession = currentWeekData?.sessions.find((s) => s.sessionNumber === currentSessionNumber);

    //   if (currentSession) {
    //     const sessionSlug = getSlugForLocale(currentSession, currentLocale);
    //     window.location.href = `/${currentLocale}/programs/${program.slug}/session/${sessionSlug}`;
    //   } else {
    //     // Fallback to first session if current session not found
    //     const firstSession = program.weeks[0]?.sessions[0];
    //     if (firstSession) {
    //       const sessionSlug = getSlugForLocale(firstSession, currentLocale);
    //       window.location.href = `/${currentLocale}/programs/${program.slug}/session/${sessionSlug}`;
    //     }
    //   }
    // } else {
    //   // Navigate to first session for new users or non-authenticated users
    //   // Enrollment and authentication will be handled on the session page
    //   const firstSession = program.weeks[0]?.sessions[0];
    //   if (firstSession) {
    //     const sessionSlug = getSlugForLocale(firstSession, currentLocale);
    //     window.location.href = `/${currentLocale}/programs/${program.slug}/session/${sessionSlug}`;
    //   }
    // }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <Breadcrumbs items={breadcrumbItems} />
        {env.NEXT_PUBLIC_TOP_PROGRAM_DETAILS_BANNER_AD_SLOT && (
          <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_PROGRAM_DETAILS_BANNER_AD_SLOT} />
        )}
        {/* Hero Image Section with Gamification */}
        <div className="relative h-40 sm:h-64 bg-gradient-to-br from-[#4F8EF7] to-[#25CB78]">
          <Image alt={programTitle} className="absolute inset-0 object-cover opacity-30" fill src={program.image} />
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Mascot Emoji */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center">
            <Image
              alt="Mascotte WorkoutCool"
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
                  {t(`levels.${program.level}` as keyof typeof t)}
                </span>
                <span className="bg-[#25CB78] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Users size={12} />
                  {program.participantCount}+
                </span>
                {/* TODO: i18n category */}
                {/* {program.isPremium && <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">Premium</span>} */}
              </div>
              <h1 className="text-3xl font-bold mb-2">{programTitle}</h1>
              {/* TODO: i18n category */}
              {/* <p className="text-white/90 text-sm">{program.category}</p> */}
            </div>
          </div>
        </div>

        <div className="px-0 sm:px-4 py-4">
          <div className="tabs tabs-lift" role="tablist">
            <button
              aria-label="À propos"
              className={`tab ${tab === "about" ? "tab-active" : ""}`}
              onClick={() => setTab("about")}
              type="button"
            >
              {t("programs.about")}
            </button>
            <button
              aria-label={t("programs.sessions")}
              className={`tab ${tab === "sessions" ? "tab-active" : ""}`}
              onClick={() => setTab("sessions")}
              type="button"
            >
              {t("programs.sessions")}
            </button>
          </div>

          {/* About Tab Content */}
          {tab === "about" && (
            <div className="bg-base-100 border-base-300 rounded-md p-2 sm:p-6">
              <div className="space-y-6">
                {/* User Progress - Only show if authenticated */}
                {isAuthenticated && <ProgramProgress programId={program.id} />}

                {/* Early Access Teaser Section - Only show if not premium */}
                {!isPremium && (
                  <div className="relative bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700 rounded-xl p-6 overflow-hidden">
                    {/* Subtle animation background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4F8EF7]/5 to-[#25CB78]/5 animate-pulse"></div>

                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] rounded-full flex items-center justify-center">
                            <Trophy className="text-white" size={24} />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("programs.important_info")}</h3>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400  italic">💡 {t("programs.donation_teaser")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gamified Community Stats */}
                <div className="bg-gradient-to-r from-[#4F8EF7]/10 to-[#25CB78]/10 border-2 border-[#4F8EF7]/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <Image
                          alt="Communauté"
                          className="w-10 h-10 object-contain"
                          height={40}
                          src="/images/emojis/WorkoutCoolHappy.png"
                          width={40}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-[#4F8EF7]">{t("programs.community")}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          +{program.participantCount} {t("programs.community_count")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="tooltip tooltip-bottom" data-tip={t("commons.share")}>
                        <ShareButton programDescription={programDescription} programTitle={programTitle} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border-2 border-[#25CB78]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-bold text-lg text-[#4F8EF7]">{t("programs.characteristics")}</h3>
                  </div>

                  {/* Compact Layout - Mobile: List, Desktop: 2 columns */}
                  <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-4 md:space-y-0">
                    <div className="flex items-center gap-4">
                      <BarChart3 className="text-[#4F8EF7] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {t(`levels.${program.level}` as keyof typeof t)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Target className="text-[#25CB78] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">{getAttributeValueLabel(program.type, t)}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Clock className="text-[#4F8EF7] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {program.durationWeeks} {t("programs.weeks")}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Calendar className="text-[#25CB78] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {program.sessionsPerWeek} {t("programs.sessions_per_week")}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Timer className="text-[#4F8EF7] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        ~{program.sessionDurationMin} {t("programs.session_duration")}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Dumbbell className="text-[#25CB78] flex-shrink-0" size={20} />
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {program.equipment.map((equipment, index) => {
                          const isFirst = index === 0;
                          const label = t(ATTRIBUTE_VALUE_TRANSLATION_KEYS[equipment] as keyof typeof t);

                          return <span key={equipment}>{isFirst ? label : `, ${label.toLocaleLowerCase()}`}</span>;
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 text-center">{programDescription}</p>
                </div>

                {/* Gamified Coaches Section */}
                {program.coaches.length > 0 && (
                  <div className="bg-gradient-to-r from-[#25CB78]/10 to-[#4F8EF7]/10 border-2 border-[#25CB78]/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-bold text-[#25CB78]">{t("programs.your_coach", { count: program.coaches.length })}</h3>
                      <div className="bg-[#25CB78] text-white px-2 py-1 rounded-full text-xs font-bold">{program.coaches.length}</div>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-2">
                      {program.coaches.map((coach) => (
                        <div
                          className="flex flex-col items-center gap-3 flex-shrink-0 p-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-[#25CB78]/20 hover:border-[#25CB78] transition-all duration-200 ease-in-out"
                          key={coach.id}
                        >
                          <div className="relative">
                            <Image
                              alt={coach.name}
                              className="w-24 h-24 rounded-full border-3 border-[#25CB78] object-cover"
                              height={96}
                              src={coach.image}
                              width={96}
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center">
                              <Image
                                alt="Coachs"
                                className="w-6 h-6 object-contain"
                                height={24}
                                src="/images/emojis/WorkoutCoolLove.png"
                                width={24}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-center">{coach.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sessions Tab Content */}
          {tab === "sessions" && (
            <div className="bg-base-100 border-base-300 rounded-box p-6">
              <div className="space-y-6">
                {/* Week Selector with DaisyUI Tabs */}
                <div className="overflow-x-auto">
                  <div className="tabs tabs-box w-fit flex-nowrap">
                    {program.weeks.map((week) => (
                      <button
                        className={`tab flex-shrink-0 ${selectedWeek === week.weekNumber ? "tab-active" : ""}`}
                        key={week.id}
                        onClick={() => setSelectedWeek(week.weekNumber)}
                      >
                        {t("programs.week_short")} {week.weekNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Week Title */}
                <h2 className="text-xl font-bold">{currentWeekTitle}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{currentWeekDescription}</p>

                {/* Gamified Sessions List */}
                <div className="space-y-3">
                  {(() => {
                    const currentWeekSessions = program.weeks.find((w) => w.weekNumber === selectedWeek)?.sessions || [];

                    if (currentWeekSessions.length === 0) {
                      return (
                        <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#4F8EF7]/20 to-[#25CB78]/20 rounded-full flex items-center justify-center">
                              <Timer className="text-[#4F8EF7]" size={32} />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{t("programs.sessions_coming_soon")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">{t("programs.sessions_in_creation")}</p>
                          </div>
                        </div>
                      );
                    }

                    return currentWeekSessions.map((session) => {
                      const sessionSlug = getSlugForLocale(session, currentLocale);
                      const sessionName = getSessionTitle(session, currentLocale);
                      const sessionDescription = getSessionDescription(session, currentLocale);

                      const isCompleted = completedSessions.has(session.id);
                      return (
                        <div
                          className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 cursor-pointer transition-all duration-200 ease-in-out flex items-center gap-4 ${
                            isCompleted
                              ? "border-[#25CB78] bg-[#25CB78]/5"
                              : session.isPremium
                                ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10 hover:border-yellow-300 hover:scale-[1.02]"
                                : "border-[#25CB78]/20 hover:border-[#25CB78] hover:scale-[1.02]"
                          }`}
                          key={session.id}
                          onClick={() => {
                            window.location.href = `/${currentLocale}/programs/${program.slug}/session/${sessionSlug}`;
                          }}
                        >
                          {/* Session Number Badge */}
                          <div className="relative">
                            <div
                              className={`w-8 sm:w-12 h-8 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white ${
                                isCompleted
                                  ? "bg-[#25CB78]"
                                  : session.isPremium
                                    ? isPremium
                                      ? "bg-[#4F8EF7]"
                                      : "bg-yellow-500"
                                    : "bg-[#25CB78]"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={18} />
                              ) : session.isPremium ? (
                                isPremium ? (
                                  <Unlock size={18} />
                                ) : (
                                  <Lock size={18} />
                                )
                              ) : (
                                <span className="text-lg">{session.sessionNumber}</span>
                              )}
                            </div>
                          </div>

                          {/* Session Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-bold ${isCompleted ? "text-[#25CB78]" : "text-gray-900 dark:text-white"}`}>
                                {sessionName}
                              </h4>
                              {isCompleted && (
                                <div className="bg-[#25CB78] text-white px-2 py-1 rounded-full text-xs font-bold">
                                  {t("programs.completed")}
                                </div>
                              )}
                              {!isCompleted && !session.isPremium && (
                                <div className="bg-[#25CB78] text-white px-2 py-1 rounded-full text-xs font-bold">{t("programs.free")}</div>
                              )}
                              {!isCompleted && session.isPremium && (
                                <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  {t("programs.premium")}
                                </div>
                              )}
                            </div>
                            {sessionDescription && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">{sessionDescription}</p>
                            )}
                            <p className="text-xs text-gray-600 mt-1">
                              {session.totalExercises} {t("programs.exercises")} • {session.estimatedMinutes} {t("programs.min_short")}
                            </p>
                          </div>

                          {/* Status Icon */}
                          <div className="w-10 h-10 flex items-center justify-center">
                            {isCompleted ? (
                              <CheckCircle2 className="text-[#25CB78]" size={24} />
                            ) : (
                              <ArrowRight className="text-gray-600 dark:text-gray-400" size={24} />
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                {env.NEXT_PUBLIC_BOTTOM_PROGRAM_DETAILS_BANNER_AD_SLOT && (
                  <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_PROGRAM_DETAILS_BANNER_AD_SLOT} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Persuasive Floating CTA - Only show if program is not completed */}
      {!isProgramCompleted && tab !== "sessions" && (
        <div className="absolute bottom-2 right-0 left-0 max-w-sm mx-auto px-4 z-[10]">
          <button
            className={
              "w-full bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] hover:from-[#4F8EF7]/90 hover:to-[#25CB78]/90 text-white px-6 py-4 font-bold border-2 border-white/20 hover:scale-[1.02] transition-all duration-200 ease-in-out z-1 flex items-center justify-center gap-2 shadow-xl rounded-full"
            }
            onClick={handleCTAClick}
          >
            <Image alt="Rejoindre" className="w-6 h-6 object-contain" height={24} src="/images/emojis/WorkoutCoolSwag.png" width={24} />
            <div className="flex flex-col items-center">
              <span className="text-base">{isAuthenticated && hasJoinedProgram ? t("programs.continue") : t("programs.join_cta")}</span>
            </div>
            <Trophy className="text-white animate-bounce" size={18} />
          </button>
        </div>
      )}

      {/* Program Completed Message */}
      {isProgramCompleted && (
        <div className="absolute bottom-2 right-0 left-0 max-w-xs mx-auto bg-gradient-to-r from-[#25CB78] to-[#4F8EF7] text-white px-4 py-3 rounded-full font-bold border-2 border-white/20 z-1 flex items-center justify-center gap-2">
          <Trophy className="text-white" size={18} />
          {t("programs.program_completed")}
          <CheckCircle2 className="text-white" size={18} />
        </div>
      )}

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onJoin={handleJoinProgram}
        programDuration={`${program.durationWeeks} ${t("programs.weeks")}`}
        programFrequency={`${program.sessionsPerWeek} ${t("programs.sessions_per_week")}`}
        programLevel={t(`levels.${program.level}` as keyof typeof t)}
        programTitle={programTitle}
      />
    </div>
  );
}
