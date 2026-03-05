import Link from "next/link";
import { Search, Dumbbell } from "lucide-react";

import { Locale } from "locales/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { getExercises, type ExerciseFilters } from "@/entities/exercise/actions/get-exercises.action";

interface ExercisesPageProps {
  locale: Locale;
  filters: ExerciseFilters;
}

const CATEGORY_LABELS: Record<string, string> = {
  push_horizontal: "Push Horizontal",
  push_vertical: "Push Vertical",
  pull_horizontal: "Pull Horizontal",
  pull_vertical: "Pull Vertical",
  core_anterior: "Core Anterior",
  core_posterior: "Core Posterior",
  core_stability: "Core Stability",
  legs: "Legs",
  skills: "Skills",
  mobility: "Mobility",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  elite: "Elite",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  elite: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Chest",
  anterior_deltoid: "Front Delts",
  triceps: "Triceps",
  latissimus_dorsi: "Lats",
  rhomboids: "Rhomboids",
  biceps: "Biceps",
  rectus_abdominis: "Abs",
  obliques: "Obliques",
  quadriceps: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  posterior_deltoid: "Rear Delts",
  trapezius: "Traps",
  forearms: "Forearms",
  calves: "Calves",
  hip_flexors: "Hip Flexors",
  erector_spinae: "Erectors",
  serratus_anterior: "Serratus",
  transverse_abdominis: "TVA",
  infraspinatus: "Infraspinatus",
};

const CATEGORIES = [
  "push_horizontal", "push_vertical", "pull_horizontal", "pull_vertical",
  "core_anterior", "core_posterior", "core_stability", "legs", "skills", "mobility",
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced", "elite"];

const MUSCLES = [
  "chest", "anterior_deltoid", "triceps", "latissimus_dorsi", "rhomboids",
  "biceps", "rectus_abdominis", "obliques", "quadriceps", "hamstrings", "glutes",
];

function buildFilterUrl(
  baseFilters: ExerciseFilters,
  overrides: Partial<ExerciseFilters>,
  locale: string,
): string {
  const merged = { ...baseFilters, ...overrides };
  const params = new URLSearchParams();
  if (merged.search) params.set("search", merged.search);
  if (merged.category) params.set("category", merged.category);
  if (merged.muscle) params.set("muscle", merged.muscle);
  if (merged.difficulty) params.set("difficulty", merged.difficulty);
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));
  const qs = params.toString();
  return `/${locale}/exercises${qs ? `?${qs}` : ""}`;
}

export async function ExercisesPage({ locale, filters }: ExercisesPageProps) {
  const result = await getExercises(filters);
  const { exercises, total, page, totalPages } = result;

  return (
    <main className="flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F8EF7] via-[#4F8EF7] to-[#25CB78]" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="w-7 h-7 text-white" />
            {/* TODO: i18n */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Exercises</h1>
          </div>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-lg">
            {/* TODO: i18n */}
            Browse our exercise library and find the perfect movements for your training.
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className="p-4 sm:p-6">
        <form className="flex flex-col sm:flex-row gap-3 mb-6" method="GET">
          {/* Preserve other filters as hidden inputs when searching */}
          {filters.category && <input name="category" type="hidden" value={filters.category} />}
          {filters.muscle && <input name="muscle" type="hidden" value={filters.muscle} />}
          {filters.difficulty && <input name="difficulty" type="hidden" value={filters.difficulty} />}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#4F8EF7] dark:text-white"
              defaultValue={filters.search ?? ""}
              name="search"
              placeholder="Search exercises..." // TODO: i18n
              type="text"
            />
          </div>

          <button
            className="px-4 py-2.5 bg-[#4F8EF7] text-white rounded-lg text-sm font-medium hover:bg-[#3d7ae6] transition-colors"
            type="submit"
          >
            {/* TODO: i18n */}
            Search
          </button>
        </form>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Category filter */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</span>
            <div className="flex flex-wrap gap-1.5">
              <Link
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !filters.category
                    ? "bg-[#4F8EF7] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                href={buildFilterUrl({ ...filters, category: undefined }, { page: 1 }, locale)}
              >
                All
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.category === cat
                      ? "bg-[#4F8EF7] text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  href={buildFilterUrl(filters, { category: cat, page: 1 }, locale)}
                  key={cat}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Difficulty</span>
            <div className="flex flex-wrap gap-1.5">
              <Link
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !filters.difficulty
                    ? "bg-[#4F8EF7] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                href={buildFilterUrl({ ...filters, difficulty: undefined }, { page: 1 }, locale)}
              >
                All
              </Link>
              {DIFFICULTIES.map((diff) => (
                <Link
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.difficulty === diff
                      ? "bg-[#4F8EF7] text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  href={buildFilterUrl(filters, { difficulty: diff, page: 1 }, locale)}
                  key={diff}
                >
                  {DIFFICULTY_LABELS[diff] ?? diff}
                </Link>
              ))}
            </div>
          </div>

          {/* Muscle filter */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Muscle Group</span>
            <div className="flex flex-wrap gap-1.5">
              <Link
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !filters.muscle
                    ? "bg-[#4F8EF7] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                href={buildFilterUrl({ ...filters, muscle: undefined }, { page: 1 }, locale)}
              >
                All
              </Link>
              {MUSCLES.map((m) => (
                <Link
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.muscle === m
                      ? "bg-[#4F8EF7] text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  href={buildFilterUrl(filters, { muscle: m, page: 1 }, locale)}
                  key={m}
                >
                  {MUSCLE_LABELS[m] ?? m}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {/* TODO: i18n */}
          {total} exercise{total !== 1 ? "s" : ""} found
        </p>

        {/* Exercise grid */}
        {exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Dumbbell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              {/* TODO: i18n */}
              No exercises found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {exercises.map((exercise) => (
              <Link href={`/${locale}/exercises/${exercise.slug}`} key={exercise.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 group-hover:text-[#4F8EF7] transition-colors line-clamp-2">
                      {exercise.nameEn ?? exercise.name}
                    </h3>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        size="small"
                      >
                        {CATEGORY_LABELS[exercise.category] ?? exercise.category}
                      </Badge>
                      <Badge
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[exercise.difficultyLevel] ?? ""}`}
                        size="small"
                      >
                        {DIFFICULTY_LABELS[exercise.difficultyLevel] ?? exercise.difficultyLevel}
                      </Badge>
                    </div>

                    {exercise.primaryMuscles.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exercise.primaryMuscles.slice(0, 2).map((muscle) => (
                          <span
                            className="text-[10px] text-gray-500 dark:text-gray-400"
                            key={muscle}
                          >
                            {MUSCLE_LABELS[muscle] ?? muscle}
                          </span>
                        ))}
                        {exercise.primaryMuscles.length > 2 && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            +{exercise.primaryMuscles.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={page <= 1}
                    href={page > 1 ? buildFilterUrl(filters, { page: page - 1 }, locale) : "#"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, and pages near current
                    return p === 1 || p === totalPages || Math.abs(p - page) <= 2;
                  })
                  .map((p, idx, arr) => {
                    const elements = [];
                    // Add ellipsis if gap between consecutive shown pages
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      elements.push(
                        <PaginationItem key={`ellipsis-${p}`}>
                          <span className="grid size-[30px] place-content-center text-xs text-gray-400">...</span>
                        </PaginationItem>,
                      );
                    }
                    elements.push(
                      <PaginationItem key={p}>
                        <PaginationLink href={buildFilterUrl(filters, { page: p }, locale)} isActive={p === page}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>,
                    );
                    return elements;
                  })}
                <PaginationItem>
                  <PaginationNext
                    disabled={page >= totalPages}
                    href={page < totalPages ? buildFilterUrl(filters, { page: page + 1 }, locale) : "#"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </main>
  );
}
