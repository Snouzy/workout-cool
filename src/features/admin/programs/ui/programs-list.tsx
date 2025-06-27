import Link from "next/link";
import Image from "next/image";
import { Eye, Edit, Users, Dumbbell } from "lucide-react";

import { getPrograms } from "../actions/get-programs.action";
import { VisibilityBadge } from "./visibility-badge";
import { DeleteProgramButton } from "./delete-program-button";

export async function ProgramsList() {
  const programs = await getPrograms();

  if (programs.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body flex flex-col items-center justify-center py-12">
          <Dumbbell className="h-12 w-12 text-base-content/60 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun programme</h3>
          <p className="text-base-content/60 text-center max-w-md">Commencez par créer votre premier programme d&apos;entraînement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Programme</th>
            <th>Statut</th>
            <th>Durée</th>
            <th>Contenu</th>
            <th>Inscrits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program.id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <Image alt={program.title} height={48} src={program.image} width={48} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">{program.title}</div>
                    <div className="text-sm opacity-50 line-clamp-2 max-w-xs">{program.description}</div>
                    <div className="flex gap-1 mt-1">
                      <div className={`badge badge-xs ${program.isPremium ? "badge-primary" : "badge-secondary"}`}>
                        {program.isPremium ? "Premium" : "Gratuit"}
                      </div>
                      <div className="badge badge-xs badge-outline">{program.level}</div>
                      <div className="badge badge-xs badge-ghost">{program.category}</div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <VisibilityBadge currentVisibility={program.visibility} programId={program.id} />
              </td>
              <td>
                <div className="text-sm">
                  <div className="font-semibold">{program.durationWeeks} semaines</div>
                  <div className="text-xs opacity-50">{program.sessionsPerWeek} séances/sem</div>
                </div>
              </td>
              <td>
                <div className="text-sm">
                  <div>
                    {program.totalWeeks} sem • {program.totalSessions} séances
                  </div>
                  <div className="text-xs opacity-50">{program.totalExercises} exercices</div>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 opacity-50" />
                  <span className="font-semibold">{program.totalEnrollments}</span>
                </div>
              </td>
              <td>
                <div className="flex gap-1">
                  <Link className="btn btn-ghost btn-xs" href={`/programs/${program.slug}`} target="_blank" title="Voir le programme">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link className="btn btn-ghost btn-xs" href={`/admin/programs/${program.id}/edit`} title="Gérer le programme">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <DeleteProgramButton programId={program.id} programTitle={program.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
