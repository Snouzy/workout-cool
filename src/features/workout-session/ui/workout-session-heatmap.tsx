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

const DEFAULT_WEEK_NAMES = ["L", "M", "M", "J", "V", "S", "D"]; // TODO i18n
const DEFAULT_MONTH_NAMES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]; // TODO i18n
const DEFAULT_PANEL_COLORS = ["#EEE", "#34D399", "#059669", "#065F46", "#042F2E"];
const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";

const PANEL_SIZE = 18;
const PANEL_MARGIN = 2;
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
  const [hovered, setHovered] = useState<null | {
    i: number;
    j: number;
    tooltip: React.ReactNode;
    mouseX: number;
    mouseY: number;
  }>(null);

  //   responsive: adapt the number of columns to the width
  useEffect(() => {
    function updateColumns() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const available = Math.floor((width - WEEK_LABEL_WIDTH) / (PANEL_SIZE + PANEL_MARGIN));
      setColumns(Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, available)));
    }
    updateColumns();
    const observer = new window.ResizeObserver(updateColumns);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  //   matrix of contributions
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

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < 7; j++) {
      const contribution = contributions[i][j];
      if (contribution === null) continue;
      const x = WEEK_LABEL_WIDTH + (PANEL_SIZE + PANEL_MARGIN) * i;
      const y = MONTH_LABEL_HEIGHT + (PANEL_SIZE + PANEL_MARGIN) * j;
      const numOfColors = panelColors.length;
      const color = contribution.value >= numOfColors ? panelColors[numOfColors - 1] : panelColors[contribution.value];
      // TODO i18n
      const d = dayjs(until, dateFormat)
        .endOf("week")
        .subtract((columns - i - 1) * 7 + (6 - j), "day");
      const dateStr = d.format(dateFormat);
      const tooltip =
        contribution.value > 0 ? (
          <div className="text-xs text-slate-50">
            {dateStr} : <br />
            {contribution.value} workout{contribution.value > 1 ? "s" : ""}
          </div>
        ) : (
          <div className="text-xs text-slate-50">
            {dateStr} : <br /> No workout
          </div>
        );
      innerDom.push(
        <rect
          fill={color}
          height={PANEL_SIZE}
          key={`panel_${i}_${j}`}
          onMouseEnter={(e) => setHovered({ i, j, tooltip, mouseX: e.clientX, mouseY: e.clientY })}
          onMouseLeave={() => setHovered(null)}
          onMouseMove={(e) => setHovered((prev) => prev && { ...prev, mouseX: e.clientX, mouseY: e.clientY })}
          rx={3}
          style={{
            cursor: "pointer",
            stroke: hovered && hovered.i === i && hovered.j === j ? "#059669" : "transparent",
            strokeWidth: hovered && hovered.i === i && hovered.j === j ? 2 : 0,
            opacity: hovered && hovered.i === i && hovered.j === j ? 0.85 : 1,
            transition: "stroke 0.1s, opacity 0.1s",
          }}
          width={PANEL_SIZE}
          x={x}
          y={y}
        />,
      );
    }
  }

  for (let i = 0; i < weekNames.length; i++) {
    const x = WEEK_LABEL_WIDTH / 2;
    const y = MONTH_LABEL_HEIGHT + (PANEL_SIZE + PANEL_MARGIN) * i + PANEL_SIZE / 2;
    innerDom.push(
      <text alignmentBaseline="central" fill="#AAA" fontSize={10} key={`week_label_${i}`} textAnchor="middle" x={x} y={y}>
        {weekNames[i]}
      </text>,
    );
  }

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

  const tooltipNode = hovered ? (
    <div
      style={{
        position: "fixed",
        left: hovered.mouseX + 12,
        top: hovered.mouseY - 8,
        pointerEvents: "none",
        zIndex: 9999,
        background: "rgba(33,33,33,0.97)",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 13,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
        maxWidth: 220,
      }}
    >
      {hovered.tooltip}
    </div>
  ) : null;

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      <svg
        height={MONTH_LABEL_HEIGHT + (PANEL_SIZE + PANEL_MARGIN) * 7}
        style={{ fontFamily: "Helvetica, Arial, sans-serif", width: "100%", display: "block" }}
      >
        {innerDom}
      </svg>
      {tooltipNode}
    </div>
  );
};
