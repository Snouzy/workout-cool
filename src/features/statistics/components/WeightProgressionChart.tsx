"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

import { useI18n, useCurrentLocale } from "locales/client";
import { WeightProgressionPoint } from "@/shared/types/statistics.types";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/date";

import { useChartTheme } from "../hooks/use-chart-theme";

interface WeightProgressionChartProps {
  data: WeightProgressionPoint[];
  width?: number;
  height?: number;
  unit?: "kg" | "lbs";
  className?: string;
}

export function WeightProgressionChart({ data, height = 300, unit = "kg", className }: WeightProgressionChartProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const { colors } = useChartTheme();

  // Format date for display
  const formatChartDate = (dateString: string) => {
    return formatDate(dateString, locale, "MMM D");
  };

  // Generate skeleton data for empty state
  const generateSkeletonData = () => {
    const now = new Date();
    const skeletonData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      skeletonData.push({
        date: date.toISOString(),
        weight: 30 + Math.random() * 40, // Random weight between 30-70
        formattedDate: formatChartDate(date.toISOString()),
      });
    }
    return skeletonData;
  };

  // Use real data or skeleton data
  const hasData = data.length > 0;
  const chartData = hasData
    ? data.map((point) => ({
        ...point,
        formattedDate: formatChartDate(point.date),
      }))
    : generateSkeletonData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && hasData) {
      return (
        <div
          className="p-3 rounded-lg shadow-lg border"
          style={{
            backgroundColor: colors.tooltipBackground,
            borderColor: colors.tooltipBorder,
            color: colors.text,
          }}
        >
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            {t("statistics.weight")}: {payload[0].value} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      aria-label={t("statistics.weight_progression_chart")}
      className={cn("rounded-lg p-4 shadow-sm relative border border-gray-400 dark:border-gray-600", className)}
      role="img"
      style={{ backgroundColor: colors.cardBackground }}
    >
      <h3 className="mb-4 text-lg font-semibold" style={{ color: colors.text }}>
        {t("statistics.weight_progression")}
      </h3>

      <div style={{ opacity: hasData ? 1 : 0.2 }}>
        <ResponsiveContainer height={height} width="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
            <XAxis
              axisLine={{ stroke: colors.border }}
              dataKey="formattedDate"
              tick={{ fontSize: 12, fill: colors.textMuted }}
              tickLine={{ stroke: colors.border }}
            />
            <YAxis
              axisLine={{ stroke: colors.border }}
              label={{
                value: `${t("statistics.weight")} (${unit})`,
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: colors.text },
              }}
              tick={{ fontSize: 12, fill: colors.textMuted }}
              tickLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              activeDot={{ r: 6, fill: "#3B82F6" }}
              dataKey="weight"
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              stroke="#3B82F6"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold" style={{ color: colors.text }}>
              {t("statistics.no_data_yet")}
            </p>
            <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
              {t("statistics.start_tracking")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
