"use client";

import React, { useMemo } from "react";
import { Info } from "lucide-react";

import { useI18n } from "locales/client";
import { OneRepMaxPoint } from "@/shared/types/statistics.types";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OneRepMaxChartProps {
  data: OneRepMaxPoint[];
  formula: string;
  formulaDescription: string;
  width?: number;
  height?: number;
  unit?: "kg" | "lbs";
  className?: string;
}

const CHART_PADDING = { top: 20, right: 20, bottom: 40, left: 50 };
const POINT_RADIUS = 4;
const GRID_LINES = 5;

export function OneRepMaxChart({
  data,
  formula,
  formulaDescription,
  width = 600,
  height = 300,
  unit = "kg",
  className,
}: OneRepMaxChartProps) {
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

    const values = data.map(d => d.estimatedOneRepMax);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valuePadding = (maxValue - minValue) * 0.1 || 10;
    
    const yMin = Math.max(0, minValue - valuePadding);
    const yMax = maxValue + valuePadding;
    
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
        const y = yScale(point.estimatedOneRepMax) + CHART_PADDING.top;
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
            {t("statistics.no_1rm_data")}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {t("statistics.complete_sets_with_weight")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      aria-label={t("statistics.one_rep_max_chart")}
      className={cn("rounded-lg bg-white p-4 shadow-sm", className)}
      role="img"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {t("statistics.estimated_1rm")}
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label={t("statistics.1rm_formula_info")}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <Info className="h-4 w-4 text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-medium">{formula} Formula</p>
              <p className="mt-1 text-sm">{formulaDescription}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <svg 
        className="w-full h-auto" 
        height={height - 60}
        viewBox={`0 0 ${width} ${height - 60}`}
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
          const y = height - 60 - CHART_PADDING.bottom + 20;
          
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
          stroke="#8B5CF6"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = xScale(index) + CHART_PADDING.left;
          const y = yScale(point.estimatedOneRepMax) + CHART_PADDING.top;
          
          return (
            <g key={`point-${index}`}>
              <circle
                className="cursor-pointer transition-all hover:r-6"
                cx={x}
                cy={y}
                fill="#8B5CF6"
                r={POINT_RADIUS}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <title>
                {formatDate(point.date)}: {point.estimatedOneRepMax.toFixed(1)} {unit}
              </title>
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          fill="#374151"
          fontSize="14"
          textAnchor="middle"
          transform={`rotate(-90, 15, ${(height - 60) / 2})`}
          x={15}
          y={(height - 60) / 2}
        >
          1RM ({unit})
        </text>
      </svg>
    </div>
  );
}