import { Metadata } from "next";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez nos programmes d'entraînement structurés pour tous les niveaux",
};

export default function ProgrammesPage() {
  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-base-content dark:text-gray-100 mb-2">Programs</h1>
        <p className="text-base-content/70 dark:text-gray-400">Structured programs to progress effectively</p>
      </div>

      <div className="grid gap-4 flex-1">
        <div className="card bg-gradient-to-r from-[#4F8EF7]/10 to-[#25CB78]/10 border border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#4F8EF7] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <h3 className="font-semibold text-base-content dark:text-gray-100">Programme Débutant</h3>
              <p className="text-sm text-base-content/70 dark:text-gray-400">4 semaines • 3 séances/semaine</p>
            </div>
          </div>
          <p className="text-sm text-base-content/80 dark:text-gray-300 mb-4">
            Programme parfait pour commencer en douceur avec des exercices au poids du corps
          </p>
          <button className="btn btn-sm bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 text-white border-none transition-all duration-200">
            Commencer
          </button>
        </div>

        <div className="card bg-gradient-to-r from-[#25CB78]/10 to-[#4F8EF7]/10 border border-[#25CB78]/20 dark:border-[#25CB78]/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#25CB78] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <div>
              <h3 className="font-semibold text-base-content dark:text-gray-100">Programme Intermédiaire</h3>
              <p className="text-sm text-base-content/70 dark:text-gray-400">6 semaines • 4 séances/semaine</p>
            </div>
          </div>
          <p className="text-sm text-base-content/80 dark:text-gray-300 mb-4">
            Intensifiez vos entraînements avec des exercices plus avancés
          </p>
          <button className="btn btn-sm bg-[#25CB78] hover:bg-[#25CB78]/90 text-white border-none transition-all duration-200">
            Commencer
          </button>
        </div>

        <div className="card bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 dark:border-yellow-400/30 p-6 rounded-xl opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h3 className="font-semibold text-base-content dark:text-gray-100">Programme Avancé</h3>
              <p className="text-sm text-base-content/70 dark:text-gray-400">8 semaines • 5 séances/semaine</p>
            </div>
          </div>
          <p className="text-sm text-base-content/80 dark:text-gray-300 mb-4">Pour les athlètes expérimentés cherchant le défi ultime</p>
          <button className="btn btn-sm btn-disabled" disabled>
            Bientôt disponible
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-base-100 dark:bg-slate-800 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="font-medium text-sm text-base-content dark:text-gray-100">Suivi automatique</span>
        </div>
        <p className="text-xs text-base-content/70 dark:text-gray-400">Vos progrès sont sauvegardés automatiquement à chaque séance</p>
      </div>
    </div>
  );
}
