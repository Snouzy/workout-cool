"use client";
import React from "react";

// TODO: add other fields
interface Exercise {
  completed: boolean;
}

interface Workout {
  created_at: string; // ISO date string
  exercises: Exercise[];
}

export interface CalendarProps {
  workouts?: Workout[];
  variant?: "small" | "large";
}

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getColumns(variant: "small" | "large", width: number) {
  if (variant === "small") return 1;
  return width >= 520 ? 20 : 10;
}

function getRows(variant: "small" | "large") {
  return variant === "small" ? 6 : 7;
}

export const Calendar: React.FC<CalendarProps> = ({ workouts = [], variant = "small" }) => {
  const [width, setWidth] = React.useState(1024);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rows = getRows(variant);
  const columns = getColumns(variant, width);
  const allWorkouts = workouts;

  // Pour l'affichage des mois
  const getMonthLabel = (i: number) => {
    const date = new Date();
    date.setDate(date.getDate() + ((7 + (7 - date.getDay())) % 7));
    const days = 7 * i;
    date.setDate(date.getDate() - days);
    const month = date.toLocaleString("en-US", { month: "short" });
    date.setDate(date.getDate() - 7);
    return date.getDate() <= 7 ? month : "";
  };

  // Générer la matrice des dates (colonnes inversées)
  const getDateForCell = (col: number, row: number) => {
    const date = new Date();
    if (variant !== "small") {
      date.setDate(date.getDate() + ((7 + (7 - date.getDay())) % 7));
    }
    const days = 7 * col + row;
    date.setDate(date.getDate() - days);
    return date;
  };

  return (
    <div className="flex">
      {/* Colonne des jours */}
      {variant !== "small" && (
        <div className="flex flex-col mr-2">
          {DAYS.map((d) => (
            <div
              className="text-xs text-muted-foreground text-center h-6 flex items-center justify-end pr-1"
              key={d}
              style={{ fontSize: "0.7em", lineHeight: "2em" }}
            >
              {d}
            </div>
          ))}
        </div>
      )}
      {/* Colonnes de cases (inversées) */}
      <div className="flex">
        {Array.from({ length: columns })
          .map((_, colIdx) => (
            <div className="flex flex-col" key={`col-${colIdx}`}>
              {Array.from({ length: rows })
                .map((_, rowIdx) => {
                  const date = getDateForCell(colIdx, rowIdx);
                  const isoDate = date.toISOString().slice(0, 10);
                  const dayWorkouts = allWorkouts.filter((w) => w.created_at.slice(0, 10) === isoDate);
                  const checked = dayWorkouts.some((w) => w.exercises.every((e) => e.completed));
                  const isToday = new Date().toDateString() === date.toDateString();
                  const isFuture = new Date() < date;
                  const boxClass = "w-6 h-6 flex items-center justify-center mb-1";
                  return (
                    <div className={boxClass} key={`cell-${colIdx}-${rowIdx}`}>
                      <input
                        checked={checked}
                        className={[
                          "appearance-none w-5 h-5 border rounded transition-colors duration-200 cursor-default",
                          checked ? "bg-green-500 border-green-500" : "bg-background border-border",
                          isToday ? "border-blue-500 border-2" : "",
                          isFuture ? "opacity-30 border-dashed border-blue-400" : "",
                        ].join(" ")}
                        readOnly
                        style={{ pointerEvents: "none" }}
                        tabIndex={-1}
                        title={date.toDateString()}
                        type="checkbox"
                      />
                    </div>
                  );
                })
                .reverse()}
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
};
