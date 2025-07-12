import { useState, useEffect, useCallback } from "react";

import { releaseNotes } from "../model/notes";
import { changelogNotificationLocal, CHANGELOG_NOTIFICATION_STORAGE_KEY } from "../model/changelog-notification.local";

export interface UseChangelogNotificationReturn {
  /** Whether to show the notification badge */
  showBadge: boolean;
  /** Function to mark the changelog as seen */
  markAsSeen: () => void;
  /** Whether the system is currently checking for updates */
  isChecking: boolean;
  /** The latest release note date */
  latestReleaseDate: string | null;
  /** The last seen timestamp */
  lastSeenTimestamp: string | null;
  /** Any error that occurred */
  error: string | null;
  /** Function to manually refresh the notification state */
  refresh: () => void;
}

export interface ChangelogNotificationConfig {
  /** Whether to show badge for new users (default: true) */
  showBadgeForNewUsers?: boolean;
  /** Whether to show badge when localStorage is unavailable (default: true) */
  showBadgeOnStorageError?: boolean;
  /** Whether to automatically check on mount (default: true) */
  autoCheck?: boolean;
}

export function useChangelogNotification(config: ChangelogNotificationConfig = {}): UseChangelogNotificationReturn {
  const { showBadgeForNewUsers = true, showBadgeOnStorageError = true, autoCheck = true } = config;

  const [showBadge, setShowBadge] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [latestReleaseDate, setLatestReleaseDate] = useState<string | null>(null);
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      // Get the latest release date
      const latest = changelogNotificationLocal.getLatestReleaseDate(releaseNotes);
      setLatestReleaseDate(latest);

      // Get the last seen timestamp
      const lastSeen = changelogNotificationLocal.getLastSeenTimestamp();
      setLastSeenTimestamp(lastSeen);

      // Determine if badge should be shown
      let shouldShowBadge = false;

      if (!latest) {
        // No release notes available
        shouldShowBadge = false;
      } else if (!lastSeen) {
        // No timestamp stored (new user or cleared storage)
        shouldShowBadge = showBadgeForNewUsers;
      } else {
        // Check if there are new release notes
        shouldShowBadge = changelogNotificationLocal.hasNewReleaseNotes(releaseNotes, lastSeen);
      }

      setShowBadge(shouldShowBadge);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error checking for changelog updates:", err);

      // Show badge on error if configured to do so
      setShowBadge(showBadgeOnStorageError);
    } finally {
      setIsChecking(false);
    }
  }, [showBadgeForNewUsers, showBadgeOnStorageError]);

  const markAsSeen = useCallback(() => {
    try {
      changelogNotificationLocal.markChangelogAsSeen();
      setShowBadge(false);
      setLastSeenTimestamp(changelogNotificationLocal.getLastSeenTimestamp());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark as seen";
      setError(errorMessage);
      console.error("Error marking changelog as seen:", err);
    }
  }, []);

  const refresh = useCallback(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  // Auto-check on mount
  useEffect(() => {
    if (autoCheck) {
      checkForUpdates();
    }
  }, [checkForUpdates, autoCheck]);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CHANGELOG_NOTIFICATION_STORAGE_KEY) {
        checkForUpdates();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkForUpdates]);

  return {
    showBadge,
    markAsSeen,
    isChecking,
    latestReleaseDate,
    lastSeenTimestamp,
    error,
    refresh,
  };
}
