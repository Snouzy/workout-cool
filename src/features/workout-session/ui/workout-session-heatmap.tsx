import React, { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";

import { useI18n, useCurrentLocale } from "locales/client";

interface Props {
  panelColors?: string[];
  values: { [date: string]: number };
  until: string;
}

const DEFAULT_PANEL_COLORS = [
  "var(--color-base-300)", // 0: empty
  "var(--color-success)", // 1: low activity
  "var(--color-success-content)", // 2: medium activity
  "var(--color-success-content)", // 3: high activity
  "var(--color-success-content)", // 4: max activity
];

const PANEL_SIZE = 18;
const PANEL_MARGIN = 2;
const WEEK_LABEL_WIDTH = 18;
const MONTH_LABEL_HEIGHT = 18;
const MIN_COLUMNS = 10;
const MAX_COLUMNS = 53;

export const WorkoutSessionHeatmap: React.FC<Props> = ({ panelColors = DEFAULT_PANEL_COLORS, values, until }) => {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(MAX_COLUMNS);
  const [hovered, setHovered] = useState<null | {
    i: number;
    j: number;
    tooltip: React.ReactNode;
    mouseX: number;
    mouseY: number;
  }>(null);

  // Create a locale-specific date formatter for tooltips
  const formatDate = (date: dayjs.Dayjs) => {
    return new Intl.DateTimeFormat(currentLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date.toDate());
  };

  // Use ISO format for internal date calculations and storage
  const ISO_DATE_FORMAT = "YYYY-MM-DD";

  // Use localized translations for week and month names
  const weekNames = [
    t("heatmap.week_days_short.sunday"),
    t("heatmap.week_days_short.monday"),
    t("heatmap.week_days_short.tuesday"),
    t("heatmap.week_days_short.wednesday"),
    t("heatmap.week_days_short.thursday"),
    t("heatmap.week_days_short.friday"),
    t("heatmap.week_days_short.saturday"),
  ];
  const monthNames = [
    t("heatmap.month_names_short.january"),
    t("heatmap.month_names_short.february"),
    t("heatmap.month_names_short.march"),
    t("heatmap.month_names_short.april"),
    t("heatmap.month_names_short.may"),
    t("heatmap.month_names_short.june"),
    t("heatmap.month_names_short.july"),
    t("heatmap.month_names_short.august"),
    t("heatmap.month_names_short.september"),
    t("heatmap.month_names_short.october"),
    t("heatmap.month_names_short.november"),
    t("heatmap.month_names_short.december"),
  ];

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
    const d = dayjs(lastDay, ISO_DATE_FORMAT);
    const lastWeekend = d.endOf("week");
    const endDate = d.endOf("day");
    const result: ({ value: number; month: number } | null)[][] = [];
    for (let i = 0; i < columns; i++) {
      result[i] = [];
      for (let j = 0; j < 7; j++) {
        const date = lastWeekend.subtract((columns - i - 1) * 7 + (6 - j), "day");
        if (date <= endDate) {
          result[i][j] = {
            value: history[date.format(ISO_DATE_FORMAT)] || 0,
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
      const d = dayjs(until, ISO_DATE_FORMAT)
        .endOf("week")
        .subtract((columns - i - 1) * 7 + (6 - j), "day");
      const dateStr = formatDate(d);

      // Create tooltip content based on workout count
      const createTooltip = (workoutCount: number, date: string) => (
        <div className="text-xs text-slate-50">
          {date} : <br />
          {workoutCount} {t("heatmap.workout", { count: workoutCount })}
        </div>
      );

      const tooltip = createTooltip(contribution.value, dateStr);
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
      <text
        alignmentBaseline="central"
        fill="var(--color-base-content)"
        fontSize={10}
        key={`week_label_${i}`}
        textAnchor="middle"
        x={x}
        y={y}
      >
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
        <text
          alignmentBaseline="central"
          fill="var(--color-base-content)"
          fontSize={12}
          key={`month_label_${i}`}
          textAnchor="middle"
          x={x}
          y={y}
        >
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
        left: hovered.mouseX - 100,
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
        border: "1px solid var(--color-base-300)",
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
