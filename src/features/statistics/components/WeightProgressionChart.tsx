"use client";

import React, { useMemo } from "react";

import { useI18n } from "locales/client";
import { WeightProgressionPoint } from "@/shared/types/statistics.types";
import { cn } from "@/shared/lib/utils";

interface WeightProgressionChartProps {
  data: WeightProgressionPoint[];
  width?: number;
  height?: number;
  unit?: "kg" | "lbs";
  className?: string;
}

const CHART_PADDING = { top: 20, right: 20, bottom: 40, left: 50 };
const POINT_RADIUS = 4;
const GRID_LINES = 5;

export function WeightProgressionChart({
  data,
  width = 600,
  height = 300,
  unit = "kg",
  className,
}: WeightProgressionChartProps) {
  const t = useI18n();
  
  const chartDimensions = useMemo(() => {
    const chartWidth = width - CHART_PADDING.left - CHART_PADDING.right;
    const chartHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;
    return { chartWidth, chartHeight };
  }, [width, height]);

  const { chartWidth, chartHeight } = chartDimensions;

  // Calculate scales
  const { xScale, yScale, yAxisValues } = useMemo(() => {
    if (data.length === 0) {
      return { xScale: () => 0, yScale: () => 0, yAxisValues: [] };
    }

    const weights = data.map(d => d.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const weightPadding = (maxWeight - minWeight) * 0.1 || 10;
    
    const yMin = Math.max(0, minWeight - weightPadding);
    const yMax = maxWeight + weightPadding;
    
    // Create nice round numbers for y-axis
    const yStep = Math.ceil((yMax - yMin) / GRID_LINES);
    const yAxisValues = Array.from({ length: GRID_LINES + 1 }, (_, i) => 
      Math.round(yMin + i * yStep)
    );

    const xScale = (index: number) => (index / (data.length - 1 || 1)) * chartWidth;
    const yScale = (value: number) => chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

    return { xScale, yScale, yAxisValues };
  }, [data, chartWidth, chartHeight]);

  // Generate SVG path for the line
  const linePath = useMemo(() => {
    if (data.length === 0) return "";
    
    return data
      .map((point, index) => {
        const x = xScale(index) + CHART_PADDING.left;
        const y = yScale(point.weight) + CHART_PADDING.top;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [data, xScale, yScale]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", { 
      month: "short", 
      day: "numeric" 
    }).format(date);
  };

  if (data.length === 0) {
    return (
      <div className={cn("rounded-lg bg-white p-8 shadow-sm", className)}>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold text-gray-700">
            {t("statistics.no_data_yet")}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {t("statistics.start_tracking")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      aria-label={t("statistics.weight_progression_chart")}
      className={cn("rounded-lg bg-white p-4 shadow-sm", className)}
      role="img"
    >
      <svg 
        className="w-full h-auto" 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
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
                {value}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((point, index) => {
          if (index % Math.ceil(data.length / 5) !== 0 && index !== data.length - 1) return null;
          
          const x = xScale(index) + CHART_PADDING.left;
          const y = height - CHART_PADDING.bottom + 20;
          
          return (
            <text
              fill="#6B7280"
              fontSize="10"
              key={`x-label-${index}`}
              textAnchor="middle"
              x={x}
              y={y}
            >
              {formatDate(point.date)}
            </text>
          );
        })}

        {/* Line chart */}
        <path
          d={linePath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = xScale(index) + CHART_PADDING.left;
          const y = yScale(point.weight) + CHART_PADDING.top;
          
          return (
            <g key={`point-${index}`}>
              <circle
                className="cursor-pointer transition-all hover:r-6"
                cx={x}
                cy={y}
                fill="#3B82F6"
                r={POINT_RADIUS}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <title>
                {formatDate(point.date)}: {point.weight} {unit}
              </title>
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          fill="#374151"
          fontSize="14"
          textAnchor="middle"
          transform={`rotate(-90, 15, ${height / 2})`}
          x={15}
          y={height / 2}
        >
          {t("statistics.weight")} ({unit})
        </text>
      </svg>
    </div>
  );
}