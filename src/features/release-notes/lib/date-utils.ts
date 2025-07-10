/**
 * Utility functions for date handling in the changelog notification system
 */

/**
 * Validates if a given string is a valid ISO timestamp
 * @param timestamp String to validate
 * @returns true if valid ISO timestamp
 */
export function isValidISOTimestamp(timestamp: string): boolean {
  if (!timestamp || typeof timestamp !== "string") {
    return false;
  }

  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime()) && date.toISOString() === timestamp;
  } catch {
    return false;
  }
}

/**
 * Validates if a date string is in YYYY-MM-DD format
 * @param dateString Date string to validate
 * @returns true if valid date format
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString || typeof dateString !== "string") {
    return false;
  }

  // Check format: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Compares two date strings (YYYY-MM-DD format) with timezone awareness
 * @param date1 First date string
 * @param date2 Second date string
 * @returns negative if date1 < date2, positive if date1 > date2, 0 if equal
 */
export function compareDateStrings(date1: string, date2: string): number {
  if (!isValidDateString(date1) || !isValidDateString(date2)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getTime() - d2.getTime();
}

/**
 * Gets the current date as an ISO timestamp
 * @returns Current date as ISO timestamp string
 */
export function getCurrentISOTimestamp(): string {
  return new Date().toISOString();
}
