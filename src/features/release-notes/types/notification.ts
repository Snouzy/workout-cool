/**
 * Configuration options for the changelog notification system
 */
export interface ChangelogNotificationConfig {
  /** Whether to show badge for new users (default: true) */
  showBadgeForNewUsers?: boolean;
  /** Whether to show badge when localStorage is unavailable (default: true) */
  showBadgeOnStorageError?: boolean;
  /** Custom storage key (default: "lastSeenChangelog") */
  storageKey?: string;
}

/**
 * Result of checking for new release notes
 */
export interface NotificationCheckResult {
  /** Whether to show the notification badge */
  showBadge: boolean;
  /** The latest release note date */
  latestReleaseDate: string | null;
  /** The last seen timestamp */
  lastSeenTimestamp: string | null;
  /** Any error that occurred during checking */
  error?: string;
}

/**
 * Hook return type for useChangelogNotification
 */
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
}

/**
 * Badge component props
 */
export interface ChangelogNotificationBadgeProps {
  /** Whether to show the badge */
  show: boolean;
  /** Custom CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Custom size (small, medium, large) */
  size?: "small" | "medium" | "large";
  /** Custom color theme */
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
}

/**
 * Enhanced ReleaseNotesDialog props
 */
export interface EnhancedReleaseNotesDialogProps {
  /** Function called when dialog is opened */
  onOpen?: () => void;
  /** Function called when dialog is closed */
  onClose?: () => void;
  /** Whether to show the notification badge */
  showNotificationBadge?: boolean;
  /** Custom badge props */
  badgeProps?: Partial<ChangelogNotificationBadgeProps>;
}

/**
 * localStorage service interface
 */
export interface ChangelogNotificationLocalStorage {
  /** Get the last seen timestamp */
  getLastSeenTimestamp: () => string | null;
  /** Set the last seen timestamp */
  setLastSeenTimestamp: (timestamp: string) => void;
  /** Get the latest release date from notes */
  getLatestReleaseDate: (notes: Array<{ date: string }>) => string | null;
  /** Check if there are new release notes */
  hasNewReleaseNotes: (notes: Array<{ date: string }>, lastSeenTimestamp: string | null) => boolean;
  /** Mark the changelog as seen */
  markChangelogAsSeen: () => void;
}

/**
 * Date utility functions interface
 */
export interface DateUtils {
  /** Validate ISO timestamp */
  isValidISOTimestamp: (timestamp: string) => boolean;
  /** Compare date strings */
  compareDateStrings: (date1: string, date2: string) => number;
  /** Get current ISO timestamp */
  getCurrentISOTimestamp: () => string;
  /** Format release date for display */
  formatReleaseDate: (dateString: string, locale?: string) => string;
}

/**
 * Error types for the notification system
 */
export enum NotificationErrorType {
  STORAGE_ERROR = "STORAGE_ERROR",
  INVALID_TIMESTAMP = "INVALID_TIMESTAMP",
  INVALID_DATE_FORMAT = "INVALID_DATE_FORMAT",
  PARSING_ERROR = "PARSING_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Custom error class for notification system
 */
export class NotificationError extends Error {
  constructor(
    public type: NotificationErrorType,
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = "NotificationError";
  }
}
