import React, { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";

interface Props {
  weekNames?: string[];
  monthNames?: string[];
  panelColors?: string[];
  values: { [date: string]: number };
  until: string;
  dateFormat?: string;
}

const DEFAULT_WEEK_NAMES = ["L", "M", "M", "J", "V", "S", "D"];
const DEFAULT_MONTH_NAMES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const DEFAULT_PANEL_COLORS = ["#EEE", "#E5E7EB", "#A7F3D0", "#34D399", "#059669"];
const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";

const PANEL_SIZE = 14;
const PANEL_MARGIN = 3;
const WEEK_LABEL_WIDTH = 18;
const MONTH_LABEL_HEIGHT = 18;
const MIN_COLUMNS = 10;
const MAX_COLUMNS = 53;

export const WorkoutSessionHeatmap: React.FC<Props> = ({
  weekNames = DEFAULT_WEEK_NAMES,
  monthNames = DEFAULT_MONTH_NAMES,
  panelColors = DEFAULT_PANEL_COLORS,
  values,
  until,
  dateFormat = DEFAULT_DATE_FORMAT,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(MAX_COLUMNS);

  // Responsivité : adapte le nombre de colonnes à la largeur
  useEffect(() => {
    function updateColumns() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // Calcule le nombre de colonnes qui rentrent (en gardant un minimum)
      const available = Math.floor((width - WEEK_LABEL_WIDTH) / (PANEL_SIZE + PANEL_MARGIN));
      setColumns(Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, available)));
    }
    updateColumns();
    const observer = new window.ResizeObserver(updateColumns);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Génère la matrice des contributions (colonnes x 7 jours)
  function makeCalendarData(history: { [k: string]: number }, lastDay: string, columns: number) {
    const d = dayjs(lastDay, dateFormat);
    const lastWeekend = d.endOf("week");
    const endDate = d.endOf("day");
    const result: ({ value: number; month: number } | null)[][] = [];
    for (let i = 0; i < columns; i++) {
      result[i] = [];
      for (let j = 0; j < 7; j++) {
        const date = lastWeekend.subtract((columns - i - 1) * 7 + (6 - j), "day");
        if (date <= endDate) {
          result[i][j] = {
            value: history[date.format(dateFormat)] || 0,
            month: date.month(),
          };
        } else {
          result[i][j] = null;
        }
      }
    }
    return result;
  }

  const contributions = makeCalendarData(values, until, columns);
  const innerDom: React.ReactElement[] = [];

  // Cases (panels)
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < 7; j++) {
      const contribution = contributions[i][j];
      if (contribution === null) continue;
      const x = WEEK_LABEL_WIDTH + (PANEL_SIZE + PANEL_MARGIN) * i;
      const y = MONTH_LABEL_HEIGHT + (PANEL_SIZE + PANEL_MARGIN) * j;
      const numOfColors = panelColors.length;
      const color = contribution.value >= numOfColors ? panelColors[numOfColors - 1] : panelColors[contribution.value];
      innerDom.push(<rect fill={color} height={PANEL_SIZE} key={`panel_${i}_${j}`} width={PANEL_SIZE} x={x} y={y} />);
    }
  }

  // Labels jours (week)
  for (let i = 0; i < weekNames.length; i++) {
    const x = WEEK_LABEL_WIDTH / 2;
    const y = MONTH_LABEL_HEIGHT + (PANEL_SIZE + PANEL_MARGIN) * i + PANEL_SIZE / 2;
    innerDom.push(
      <text alignmentBaseline="central" fill="#AAA" fontSize={10} key={`week_label_${i}`} textAnchor="middle" x={x} y={y}>
        {weekNames[i]}
      </text>,
    );
  }

  // Labels mois (month)
  let prevMonth = -1;
  for (let i = 0; i < columns; i++) {
    const c = contributions[i][0];
    if (c === null) continue;
    if (columns > 1 && i === 0 && c.month !== contributions[i + 1][0]?.month) {
      continue;
    }
    if (c.month !== prevMonth) {
      const x = WEEK_LABEL_WIDTH + (PANEL_SIZE + PANEL_MARGIN) * i + PANEL_SIZE / 2;
      const y = MONTH_LABEL_HEIGHT / 1.5;
      innerDom.push(
        <text alignmentBaseline="central" fill="#AAA" fontSize={12} key={`month_label_${i}`} textAnchor="middle" x={x} y={y}>
          {monthNames[c.month]}
        </text>,
      );
    }
    prevMonth = c.month;
  }

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg
        height={MONTH_LABEL_HEIGHT + (PANEL_SIZE + PANEL_MARGIN) * 7}
        style={{ fontFamily: "Helvetica, Arial, sans-serif", width: "100%", display: "block" }}
      >
        {innerDom}
      </svg>
    </div>
  );
};
