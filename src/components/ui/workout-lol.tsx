import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const workoutLolVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-mono font-semibold transition-colors duration-200",
  {
    variants: {
      variant: {
        default: [
          "bg-red-50 text-red-600 ring-1 ring-inset ring-red-200",
          "dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/30",
          "hover:bg-red-100 dark:hover:bg-red-950/50",
        ],
        muted: [
          "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
          "dark:bg-slate-900/50 dark:text-slate-400 dark:ring-slate-800",
          "hover:bg-slate-200 dark:hover:bg-slate-900/70",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface WorkoutLolProps extends VariantProps<typeof workoutLolVariants> {
  className?: string;
  children?: React.ReactNode;
}

export const WorkoutLol = ({ className, variant, children }: WorkoutLolProps) => {
  return <span className={cn(workoutLolVariants({ variant }), className)}>{children || "workout.lol"}</span>;
};

export const WorkoutLolMuted = ({ className, children }: Omit<WorkoutLolProps, "variant">) => (
  <WorkoutLol className={className} variant="muted">
    {children}
  </WorkoutLol>
);
