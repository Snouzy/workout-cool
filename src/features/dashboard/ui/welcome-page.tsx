import { TrendingUp, Dumbbell, BarChart3, LogIn, UserPlus } from "lucide-react";

import { Link } from "@/components/ui/link";

interface WelcomePageProps {
  locale: string;
}

export function WelcomePage({ locale }: WelcomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CaliGym</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Track your calisthenics progression. Level up from beginner to advanced with structured training families.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Dumbbell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Browse exercises with video guides
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Follow structured progressions for each skill
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Track sets, reps, form quality and RPE
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          className="!no-underline flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors text-sm"
          href={`/${locale}/auth/signin`}
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Link>
        <Link
          className="!no-underline flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors text-sm"
          href={`/${locale}/auth/signup`}
        >
          <UserPlus className="w-4 h-4" />
          Sign Up
        </Link>
      </div>
    </div>
  );
}
