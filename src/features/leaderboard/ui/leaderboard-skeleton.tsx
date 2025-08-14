import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardSkeleton: React.FC = () => (
  <div className="divide-y divide-gray-200 dark:divide-gray-700">
    {[...Array(5)].map((_, i) => (
      <div className="flex items-center gap-4 p-6" key={i}>
        <Skeleton className="w-8 h-6" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-8 w-12 ml-auto" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default LeaderboardSkeleton;
