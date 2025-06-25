import Link from "next/link";
import Image from "next/image";
import { Eye, Edit, Users, Calendar, Dumbbell } from "lucide-react";

import { getPrograms } from "../actions/get-programs.action";
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <div className="card bg-base-100 shadow-xl overflow-hidden" key={program.id}>
          <div className="relative h-48">
            <Image alt={program.title} className="object-cover" fill src={program.image} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-4 left-4">
              <div className={`badge ${program.isPremium ? "badge-primary" : "badge-secondary"}`}>
                {program.isPremium ? "Premium" : "Gratuit"}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="badge badge-outline bg-white/20 text-white border-white/30">{program.level}</div>
            </div>
          </div>

          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <h2 className="card-title truncate">{program.title}</h2>
              {program.emoji && (
                <Image alt="Emoji" className="flex-shrink-0" height={24} src={`/images/emojis/${program.emoji}`} width={24} />
              )}
            </div>
            <p className="text-sm text-base-content/60 line-clamp-2 mb-4">{program.description}</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-base-content/60" />
                  <span>{program.durationWeeks} semaines</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-base-content/60" />
                  <span>{program.totalEnrollments} inscrits</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-base-content/60">
                <div className="text-center">
                  <div className="font-semibold text-base-content">{program.totalWeeks}</div>
                  <div>Semaines</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-base-content">{program.totalSessions}</div>
                  <div>Séances</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-base-content">{program.totalExercises}</div>
                  <div>Exercices</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link className="btn btn-outline btn-sm flex-1" href={`/programs/${program.slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Link>
                <Link className="btn btn-outline btn-sm flex-1" href={`/admin/programs/${program.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Gérer
                </Link>
                <DeleteProgramButton programId={program.id} programTitle={program.title} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
