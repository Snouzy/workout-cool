import Calendar from "react-github-contribution-calendar";
import React from "react";

import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";

// À placer dans le layout _app.tsx ou équivalent pour charger le CSS

export function WorkoutSessionCalendar() {
  // Récupère toutes les séances
  const sessions = typeof window !== "undefined" ? workoutSessionLocal.getAll() : [];

  // Génère un objet { 'YYYY-MM-DD': count } pour chaque jour avec au moins un workout
  const values: Record<string, number> = {};
  sessions.forEach((session) => {
    // On ne compte qu'une fois par jour, même si plusieurs séances
    const date = session.startedAt.slice(0, 10);
    values[date] = (values[date] || 0) + 1;
  });

  // Trouve la date la plus récente pour le paramètre 'until'
  const until =
    sessions.length > 0
      ? sessions.reduce((max, s) => (s.startedAt > max ? s.startedAt : max), sessions[0].startedAt).slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  // Customisation
  const panelColors = ["#E5E7EB", "#A7F3D0", "#34D399", "#059669", "#065F46"];
  const weekNames = ["L", "M", "M", "J", "V", "S", "D"]; // TODO: i18n
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]; // TODO: i18n
  const panelAttributes = { rx: 1, ry: 1, height: 10, width: 10 };
  const weekLabelAttributes = { style: { fontSize: 10, fill: "#888" } };
  const monthLabelAttributes = { style: { fontSize: 10, fill: "#333" } };

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold mb-2">Historique d&apos;entraînement</h3>
      <Calendar
        monthLabelAttributes={monthLabelAttributes}
        monthNames={monthNames}
        panelAttributes={panelAttributes}
        panelColors={panelColors}
        until={until}
        values={values}
        weekLabelAttributes={weekLabelAttributes}
        weekNames={weekNames}
      />
    </div>
  );
}
