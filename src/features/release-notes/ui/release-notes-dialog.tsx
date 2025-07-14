"use client";

import * as React from "react";
import { Bell } from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { formatDate } from "@/shared/lib/date";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { releaseNotes } from "../model/notes";
import { useChangelogNotification } from "../hooks/use-changelog-notification";
import { ChangelogNotificationBadge } from "./changelog-notification-badge";

export interface ReleaseNotesDialogProps {
  /** Function called when dialog is opened */
  onOpen?: () => void;
  /** Function called when dialog is closed */
  onClose?: () => void;
  /** Whether to show the notification badge */
  showNotificationBadge?: boolean;
}

export function ReleaseNotesDialog({ onOpen, onClose, showNotificationBadge = true }: ReleaseNotesDialogProps = {}) {
  const t = useI18n();
  const locale = useCurrentLocale();

  // Use the changelog notification hook
  const { showBadge, markAsSeen } = useChangelogNotification();

  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen) {
      markAsSeen();
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <div className="tooltip tooltip-bottom z-10" data-tip={t("commons.changelog")}>
          <div className="relative">
            <Button aria-label={t("release_notes.release_notes")} className="rounded-full hover:bg-slate-200" size="small" variant="ghost">
              <Bell className="text-blue-500 dark:text-blue-400 h-6 w-6" />
            </Button>
            {showNotificationBadge && <ChangelogNotificationBadge show={showBadge} size="small" variant="primary" />}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("release_notes.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {releaseNotes.map((note) => (
            <div className="border-b pb-2 last:border-b-0 last:pb-0 py-2" key={note.date}>
              <div className="text-xs text-muted-foreground">{formatDate(note.date, locale)}</div>
              <div className="font-semibold mb-1" dangerouslySetInnerHTML={{ __html: t(note.titleKey as keyof typeof t) }} />
              <div className="text-sm mb-4" dangerouslySetInnerHTML={{ __html: t(note.contentKey as keyof typeof t) }} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
