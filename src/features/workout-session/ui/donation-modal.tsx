"use client";

import { useEffect, useRef } from "react";
import { Heart, X, Code, Server } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    modal.showModal();

    if (isOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      onClose();
    };

    modal.addEventListener("close", handleClose);
    return () => modal.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleDonate = () => {
    window.open("https://ko-fi.com/workoutcool", "_blank");
    onClose();
  };

  return (
    <dialog className="modal modal-bottom sm:modal-middle" ref={modalRef} style={{ padding: 0 }}>
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Soutenez le projet</h3>
          </div>
          <form method="dialog">
            <Button className="p-1" size="small" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Félicitations pour la séance ! 🎉</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
              Cette app vous aide gratuitement, mais elle a un coût réel pour moi...
            </p>
          </div>

          {/* Transparency section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">La réalité des coûts</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              Actuellement, les donations ne couvrent même pas les coûts de base : serveurs, authentification, infrastructure, base de
              données, etc.
            </p>
          </div>

          {/* Open source value */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">100% Open Source</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              Cette app est entièrement gratuite et open source. Aucun profit n&apos;est généré - c&apos;est un projet de passion pour aider
              la communauté et aider les gens à faire du sport.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs ">
              <div className="flex items-center justify-center gap-1 text-blue-700 dark:text-blue-400">
                <Heart className="h-3 w-3" />
                <span>Pas de pub</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-blue-700 dark:text-blue-400">
                <Heart className="h-3 w-3" />
                <span>Pas de tracking</span>
              </div>
            </div>
          </div>

          {/* Impact section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Votre impact</span>
            </div>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>
                • <strong>Même 3€</strong> couvrent 1 semaine de serveur
              </li>

              <li>
                • <strong>Votre soutien</strong> garde l&apos;app gratuite pour tous
              </li>
            </ul>
            <p className="text-xs text-center text-green-700 dark:text-green-400 mt-2 font-medium">
              Chaque don, même petit, fait une vraie différence ! 🙏
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <form className="flex gap-2 w-full flex-col sm:flex-row" method="dialog">
            <Button className="flex-1" onClick={onClose} size="small" variant="outline">
              Plus tard
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
              onClick={handleDonate}
              size="large"
            >
              <Heart className="h-4 w-4 mr-2" />
              Soutenir le projet
            </Button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
