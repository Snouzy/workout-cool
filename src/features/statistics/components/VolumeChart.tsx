"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

import { useI18n } from "locales/client";
import { VolumePoint } from "@/shared/types/statistics.types";
import { cn } from "@/shared/lib/utils";

import { useChartTheme } from "../hooks/use-chart-theme";

interface VolumeChartProps {
  data: VolumePoint[];
  width?: number;
  height?: number;
  className?: string;
}

export function VolumeChart({ data, height = 300, className }: VolumeChartProps) {
  const t = useI18n();
  const { colors } = useChartTheme();

  // Format week label
  const formatWeek = (week: string) => {
    // Format: "2024-W12" -> "W12"
    const parts = week.split("-W");
    return parts.length > 1 ? `W${parts[1]}` : week;
  };

  // Format volume for display
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  // Generate skeleton data for empty state
  const generateSkeletonData = () => {
    const now = new Date();
    const skeletonData = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      const year = date.getFullYear();
      const weekNumber = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      const week = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
      const volume = Math.floor(Math.random() * 5000) + 1000; // Random volume between 1000-6000

      skeletonData.push({
        week,
        totalVolume: volume,
        setCount: Math.floor(volume / 100), // Rough estimate of sets
        formattedWeek: formatWeek(week),
        formattedVolume: formatVolume(volume),
      });
    }
    return skeletonData;
  };

  // Use real data or skeleton data
  const hasData = data.length > 0;
  const chartData = hasData
    ? data.map((point) => ({
        ...point,
        formattedWeek: formatWeek(point.week),
        formattedVolume: formatVolume(point.totalVolume),
      }))
    : generateSkeletonData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && hasData) {
      const data = payload[0].payload;
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
          <p className="text-green-600">
            {t("statistics.volume")}: {data.formattedVolume}
          </p>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {data.setCount} sets
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      aria-label={t("statistics.volume_chart")}
      className={cn("rounded-lg p-4 shadow-sm relative border border-gray-400 dark:border-gray-600", className)}
      role="img"
      style={{ backgroundColor: colors.cardBackground }}
    >
      <h3 className="mb-4 text-lg font-semibold" style={{ color: colors.text }}>
        {t("statistics.weekly_volume")}
      </h3>

      <div style={{ opacity: hasData ? 1 : 0.2 }}>
        <ResponsiveContainer height={height} width="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
            <XAxis
              axisLine={{ stroke: colors.border }}
              dataKey="formattedWeek"
              tick={{ fontSize: 12, fill: colors.textMuted }}
              tickLine={{ stroke: colors.border }}
            />
            <YAxis
              axisLine={{ stroke: colors.border }}
              label={{
                value: t("statistics.volume"),
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: colors.text },
              }}
              tick={{ fontSize: 12, fill: colors.textMuted }}
              tickFormatter={formatVolume}
              tickLine={{ stroke: colors.border }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalVolume" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          {t("statistics.volume_calculation")}
        </p>
      </div>

      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold" style={{ color: colors.text }}>
              {t("statistics.no_volume_data")}
            </p>
            <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
              {t("statistics.complete_workouts")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
