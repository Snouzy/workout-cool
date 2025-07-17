import { useTheme } from "next-themes";

export function useChartTheme() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return {
    isDark,
    colors: {
      background: isDark ? "#1f2937" : "#ffffff",
      cardBackground: isDark ? "#374151" : "#ffffff",
      text: isDark ? "#f9fafb" : "#374151",
      textSecondary: isDark ? "#d1d5db" : "#6b7280",
      textMuted: isDark ? "#9ca3af" : "#6b7280",
      border: isDark ? "#4b5563" : "#e5e7eb",
      grid: isDark ? "#4b5563" : "#e5e7eb",
      tooltipBackground: isDark ? "#374151" : "#ffffff",
      tooltipBorder: isDark ? "#4b5563" : "#e5e7eb",
    },
  };
}
