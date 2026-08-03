import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const PARIS_TZ = "Europe/Paris";

export type LeaderboardPeriod = "all-time" | "weekly" | "monthly";

export function getDateRangeForPeriod(period: LeaderboardPeriod): { startDate: Date | undefined; endDate: Date } {
  const now = dayjs().tz(PARIS_TZ);

  switch (period) {
    case "weekly": {
      // Start of current week (Monday) in Paris timezone.
      // dayjs' default week starts on Sunday, so deriving Monday via
      // startOf("week").add(1, "day") inverts on a Sunday (start lands on the
      // following Monday, which is *after* `now`) and yields an empty range.
      // Compute Monday directly from the day-of-week instead.
      const daysSinceMonday = (now.day() + 6) % 7; // Sun→6, Mon→0, …, Sat→5
      const startOfWeek = now.subtract(daysSinceMonday, "day").startOf("day");
      return {
        startDate: startOfWeek.toDate(),
        endDate: now.toDate(),
      };
    }
    case "monthly": {
      // Start of current month in Paris timezone
      const startOfMonth = now.startOf("month");
      return {
        startDate: startOfMonth.toDate(),
        endDate: now.toDate(),
      };
    }
    case "all-time":
    default:
      return {
        startDate: undefined,
        endDate: now.toDate(),
      };
  }
}
