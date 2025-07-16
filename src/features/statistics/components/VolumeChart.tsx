"use client";

import React, { useMemo } from "react";

import { useI18n } from "locales/client";
import { VolumePoint } from "@/shared/types/statistics.types";
import { cn } from "@/shared/lib/utils";

interface VolumeChartProps {
  data: VolumePoint[];
  width?: number;
  height?: number;
  className?: string;
}

const CHART_PADDING = { top: 20, right: 20, bottom: 60, left: 60 };
const BAR_GAP = 4;
const GRID_LINES = 5;

export function VolumeChart({
  data,
  width = 600,
  height = 300,
  className,
}: VolumeChartProps) {
  const t = useI18n();
  
  const chartDimensions = useMemo(() => {
    const chartWidth = width - CHART_PADDING.left - CHART_PADDING.right;
    const chartHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;
    return { chartWidth, chartHeight };
  }, [width, height]);

  const { chartWidth, chartHeight } = chartDimensions;

  // Calculate scales and bar dimensions
  const { xScale, yScale, yAxisValues, barWidth } = useMemo(() => {
    if (data.length === 0) {
      return { xScale: () => 0, yScale: () => 0, yAxisValues: [], barWidth: 0 };
    }

    const volumes = data.map(d => d.totalVolume);
    const maxVolume = Math.max(...volumes);
    const volumePadding = maxVolume * 0.1 || 100;
    
    const yMax = maxVolume + volumePadding;
    
    // Create nice round numbers for y-axis
    const yStep = Math.ceil(yMax / GRID_LINES);
    const yAxisValues = Array.from({ length: GRID_LINES + 1 }, (_, i) => 
      Math.round(i * yStep)
    );

    const barWidth = Math.max(10, (chartWidth - (data.length - 1) * BAR_GAP) / data.length);
    const xScale = (index: number) => index * (barWidth + BAR_GAP);
    const yScale = (value: number) => chartHeight - (value / yMax) * chartHeight;

    return { xScale, yScale, yAxisValues, barWidth };
  }, [data, chartWidth, chartHeight]);

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

  if (data.length === 0) {
    return (
      <div className={cn("rounded-lg bg-white p-8 shadow-sm", className)}>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold text-gray-700">
            {t("statistics.no_volume_data")}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {t("statistics.complete_workouts")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      aria-label={t("statistics.volume_chart")}
      className={cn("rounded-lg bg-white p-4 shadow-sm", className)}
      role="img"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        {t("statistics.weekly_volume")}
      </h3>
      
      <svg 
        className="w-full h-auto" 
        height={height - 30}
        viewBox={`0 0 ${width} ${height - 30}`}
        width={width}
      >
        {/* Grid lines */}
        {yAxisValues.map((value, index) => {
          const y = yScale(value) + CHART_PADDING.top;
          return (
            <g key={`grid-${index}`}>
              <line
                stroke="#E5E7EB"
                strokeDasharray="2,2"
                strokeWidth="1"
                x1={CHART_PADDING.left}
                x2={CHART_PADDING.left + chartWidth}
                y1={y}
                y2={y}
              />
              <text
                fill="#6B7280"
                fontSize="12"
                textAnchor="end"
                x={CHART_PADDING.left - 10}
                y={y + 4}
              >
                {formatVolume(value)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((point, index) => {
          const x = xScale(index) + CHART_PADDING.left;
          const barHeight = (point.totalVolume / Math.max(...yAxisValues)) * chartHeight;
          const y = CHART_PADDING.top + chartHeight - barHeight;
          
          return (
            <g key={`bar-${index}`}>
              <rect
                className="cursor-pointer transition-opacity hover:opacity-80"
                fill="#10B981"
                height={barHeight}
                rx={4}
                ry={4}
                width={barWidth}
                x={x}
                y={y}
              >
                <title>
                  {formatWeek(point.week)}: {formatVolume(point.totalVolume)} ({point.setCount} sets)
                </title>
              </rect>
              
              {/* Week label */}
              <text
                fill="#6B7280"
                fontSize="10"
                textAnchor="middle"
                transform={`rotate(-45, ${x + barWidth / 2}, ${height - 30 - CHART_PADDING.bottom + 20})`}
                x={x + barWidth / 2}
                y={height - 30 - CHART_PADDING.bottom + 20}
              >
                {formatWeek(point.week)}
              </text>
              
              {/* Value on top of bar */}
              {barHeight > 20 && (
                <text
                  fill="#374151"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  x={x + barWidth / 2}
                  y={y - 5}
                >
                  {formatVolume(point.totalVolume)}
                </text>
              )}
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          fill="#374151"
          fontSize="14"
          textAnchor="middle"
          transform={`rotate(-90, 15, ${(height - 30) / 2})`}
          x={15}
          y={(height - 30) / 2}
        >
          {t("statistics.volume")}
        </text>
      </svg>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {t("statistics.volume_calculation")}
        </p>
      </div>
    </div>
  );
}