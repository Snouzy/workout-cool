import { isValidISOTimestamp, getCurrentISOTimestamp } from "../lib/date-utils";

import type { ReleaseNote } from "./notes";

export const CHANGELOG_NOTIFICATION_STORAGE_KEY = "lastSeenChangelog";

// Rate limiting: prevent excessive localStorage operations
const RATE_LIMIT_WINDOW = 1000; // 1 second
let lastStorageOperation = 0;

/**
 * Checks if rate limiting should be applied
 */
function shouldRateLimit(): boolean {
  const now = Date.now();
  const timeSinceLastOperation = now - lastStorageOperation;
  return timeSinceLastOperation < RATE_LIMIT_WINDOW;
}

/**
 * Updates the rate limit timestamp
 */
function updateRateLimitTimestamp(): void {
  lastStorageOperation = Date.now();
}

/**
 * Sanitizes and validates a timestamp string to prevent XSS and ensure proper format
 */
function sanitizeTimestamp(timestamp: string): string | null {
  if (!timestamp || typeof timestamp !== "string") {
    return null;
  }

  // Remove any potential HTML/script tags and trim whitespace
  const sanitized = timestamp.replace(/<[^>]*>/g, "").trim();

  return isValidISOTimestamp(sanitized) ? sanitized : null;
}

/**
 * Gets the last seen changelog timestamp from localStorage
 * @returns ISO timestamp string or null if not found/invalid
 */
function getLastSeenTimestamp(): string | null {
  try {
    const stored = localStorage.getItem(CHANGELOG_NOTIFICATION_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    return sanitizeTimestamp(stored);
  } catch (error) {
    console.warn("Failed to get last seen changelog timestamp:", error);
    // Don't throw in this case - return null to gracefully handle localStorage unavailability
    return null;
  }
}

/**
 * Sets the last seen changelog timestamp in localStorage
 * @param timestamp ISO timestamp string
 */
function setLastSeenTimestamp(timestamp: string): void {
  if (shouldRateLimit()) {
    console.warn("Rate limit exceeded for localStorage operations");
    return;
  }

  try {
    const sanitized = sanitizeTimestamp(timestamp);
    if (!sanitized) {
      console.warn("Invalid timestamp provided to setLastSeenTimestamp:", timestamp);
      return;
    }

    localStorage.setItem(CHANGELOG_NOTIFICATION_STORAGE_KEY, sanitized);
    updateRateLimitTimestamp();
  } catch (error) {
    console.error("Failed to save last seen changelog timestamp:", error);
    // Don't throw - gracefully handle localStorage unavailability
  }
}

/**
 * Gets the latest release note date from the notes array
 * @param notes Array of release notes
 * @returns Latest date string or null if array is empty
 */
function getLatestReleaseDate(notes: ReleaseNote[]): string | null {
  if (!notes || notes.length === 0) {
    return null;
  }

  // Assuming notes are sorted by date (newest first) as per assumptions
  const latestNote = notes[0];
  return latestNote?.date || null;
}

/**
 * Checks if there are new release notes since the last seen timestamp
 * @param notes Array of release notes
 * @param lastSeenTimestamp ISO timestamp of last seen changelog
 * @returns true if there are new notes to show
 */
function hasNewReleaseNotes(notes: ReleaseNote[], lastSeenTimestamp: string | null): boolean {
  if (!notes || notes.length === 0) {
    return false;
  }

  // If no timestamp is stored, show badge (new user or cleared storage)
  if (!lastSeenTimestamp) {
    return true;
  }

  const latestReleaseDate = getLatestReleaseDate(notes);
  if (!latestReleaseDate) {
    return false;
  }

  try {
    // Convert the timestamp to a date for comparison
    const lastSeenDate = new Date(lastSeenTimestamp);
    const latestDate = new Date(latestReleaseDate);

    if (isNaN(lastSeenDate.getTime()) || isNaN(latestDate.getTime())) {
      return true; // Show badge if we can't compare dates
    }

    // Check if the latest release is newer than the last seen date
    return latestDate.getTime() > lastSeenDate.getTime();
  } catch (error) {
    console.warn("Error checking for new release notes:", error);
    return true; // Show badge on error to be safe
  }
}

/**
 * Marks the changelog as seen by setting the current timestamp
 */
function markChangelogAsSeen(): void {
  const now = getCurrentISOTimestamp();
  setLastSeenTimestamp(now);
}

export const changelogNotificationLocal = {
  getLastSeenTimestamp,
  setLastSeenTimestamp,
  getLatestReleaseDate,
  hasNewReleaseNotes,
  markChangelogAsSeen,
};
