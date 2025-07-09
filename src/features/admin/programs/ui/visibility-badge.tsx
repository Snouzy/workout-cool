"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Archive, ChevronDown } from "lucide-react";
import { ProgramVisibility } from "@prisma/client";

import { updateProgramVisibility } from "../actions/update-program-visibility.action";

interface VisibilityBadgeProps {
  programId: string;
  currentVisibility: ProgramVisibility;
}

const visibilityConfig = {
  [ProgramVisibility.DRAFT]: {
    label: "Brouillon",
    icon: EyeOff,
    color: "badge-warning",
  },
  [ProgramVisibility.PUBLISHED]: {
    label: "Publié",
    icon: Eye,
    color: "badge-success",
  },
  [ProgramVisibility.ARCHIVED]: {
    label: "Archivé",
    icon: Archive,
    color: "badge-neutral",
  },
};

export function VisibilityBadge({ programId, currentVisibility }: VisibilityBadgeProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const config = visibilityConfig[currentVisibility];
  const Icon = config.icon;

  const handleVisibilityChange = async (newVisibility: ProgramVisibility) => {
    if (newVisibility === currentVisibility) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateProgramVisibility(programId, newVisibility);
      router.refresh();
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div className={`badge ${config.color} gap-1 cursor-pointer hover:opacity-80`} role="button" tabIndex={0}>
        <Icon className="w-3 h-3" />
        {config.label}
        <ChevronDown className="w-3 h-3" />
      </div>

      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52" tabIndex={0}>
        {Object.entries(ProgramVisibility).map(([key, value]) => {
          const itemConfig = visibilityConfig[value];
          const ItemIcon = itemConfig.icon;

          return (
            <li key={key}>
              <a
                className={`flex items-center gap-2 ${currentVisibility === value ? "active" : ""}`}
                onClick={() => handleVisibilityChange(value)}
              >
                {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : <ItemIcon className="w-4 h-4" />}
                {itemConfig.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
