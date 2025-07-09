"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Calendar, Clock, Users, ArrowLeft, Edit } from "lucide-react";

import { ProgramWithFullDetails } from "../types/program.types";
import { WeekCard } from "./week-card";
import { VisibilityBadge } from "./visibility-badge";
import { EditProgramModal } from "./edit-program-modal";
import { AddWeekModal } from "./add-week-modal";

interface ProgramBuilderProps {
  program: ProgramWithFullDetails;
}

export function ProgramBuilder({ program }: ProgramBuilderProps) {
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);
  const [isEditProgramModalOpen, setIsEditProgramModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link className="btn btn-ghost btn-sm" href="/admin/programs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux programmes
        </Link>
      </div>

      {/* Program Overview */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image alt={program.title} className="object-cover" fill src={program.image} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{program.title}</h1>
                </div>
                <p className="text-base-content/60 mb-3">{program.description}</p>
                <div className="flex gap-2">
                  <VisibilityBadge currentVisibility={program.visibility} programId={program.id} />
                  <div className={`badge ${program.isPremium ? "badge-primary" : "badge-secondary"}`}>
                    {program.isPremium ? "Premium" : "Gratuit"}
                  </div>
                  <div className="badge badge-outline">{program.level}</div>
                  <div className="badge badge-outline">{program.category}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button className="btn btn-sm btn-ghost" onClick={() => setIsEditProgramModalOpen(true)} title="Éditer le programme">
                <Edit className="h-4 w-4" />
              </button>
              <div className="text-right">
                <div className="text-sm text-base-content/60">Participants</div>
                <div className="text-2xl font-bold">{program.participantCount}</div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-base-content/60" />
              <span>{program.durationWeeks} semaines</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-base-content/60" />
              <span>{program.sessionDurationMin} min/séance</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-base-content/60" />
              <span>{program.sessionsPerWeek} séances/semaine</span>
            </div>
            <div>
              <span className="text-base-content/60">Équipement: </span>
              <span>{program.equipment.join(", ") || "Aucun"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coaches Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Coachs ({program.coaches.length})</h3>
            <button className="btn btn-sm btn-primary" onClick={() => setIsEditProgramModalOpen(true)} title="Éditer les coachs">
              <Edit className="h-4 w-4 mr-2" />
              Éditer les coachs
            </button>
          </div>

          {program.coaches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-base-content/60 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Aucun coach assigné</h4>
              <p className="text-base-content/60 text-center max-w-md mb-4">
                Ajoutez des coachs pour présenter les experts qui accompagneront les utilisateurs.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setIsEditProgramModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un coach
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {program.coaches.map((coach) => (
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg" key={coach.id}>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image alt={coach.name} className="object-cover" fill src={coach.image} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{coach.name}</h5>
                    <span className="text-xs text-base-content/60">Coach #{coach.order + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="space-y-6">
        <div className="space-y-6">
          {/* Add Week Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Semaines ({program.weeks.length}/{program.durationWeeks})
            </h3>
            <button className="btn btn-primary" onClick={() => setIsAddWeekModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une semaine
            </button>
          </div>

          {/* Weeks List */}
          <div className="space-y-4">
            {program.weeks.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-base-content/60 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Aucune semaine créée</h4>
                  <p className="text-base-content/60 text-center max-w-md mb-4">
                    Commencez par ajouter la première semaine de votre programme.
                  </p>
                  <button className="btn btn-primary" onClick={() => setIsAddWeekModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter la première semaine
                  </button>
                </div>
              </div>
            ) : (
              program.weeks.map((week) => <WeekCard key={week.id} week={week} />)
            )}
          </div>
        </div>

        {/* Analytics Tab Content */}
        <div className="hidden" id="analytics-content">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Statistiques</h2>
              <p className="text-base-content/60">Analytics et métriques du programme (à implémenter)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Week Modal */}
      <AddWeekModal
        nextWeekNumber={program.weeks.length + 1}
        onOpenChange={setIsAddWeekModalOpen}
        open={isAddWeekModalOpen}
        programId={program.id}
      />

      {/* Edit Program Modal */}
      <EditProgramModal onOpenChange={setIsEditProgramModalOpen} open={isEditProgramModalOpen} program={program} />
    </div>
  );
}
